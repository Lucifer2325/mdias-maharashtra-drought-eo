"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppLang, translateTextToMarathi } from "@/lib/i18n";

interface AnnotatedTextNode extends Text {
  __origEn?: string;
  __lastMr?: string;
}

export function MarathiDomTranslator() {
  const { lang } = useAppLang();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;

    let isApplying = false;

    const applyTranslation = (root: Node) => {
      if (isApplying) return;
      isApplying = true;
      try {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.hasAttribute("data-no-i18n")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        });

        let current = walker.nextNode() as AnnotatedTextNode | null;
        while (current) {
          const val = current.nodeValue ?? "";
          if (val.trim().length > 0) {
            if (lang === "mr") {
              if (current.__origEn === undefined || val !== current.__lastMr) {
                current.__origEn = val;
              }
              const translated = translateTextToMarathi(current.__origEn);
              if (translated !== val) {
                current.__lastMr = translated;
                current.nodeValue = translated;
              }
            } else if (lang === "en" && current.__origEn !== undefined) {
              if (val === current.__lastMr && current.nodeValue !== current.__origEn) {
                current.nodeValue = current.__origEn;
              }
            }
          }
          current = walker.nextNode() as AnnotatedTextNode | null;
        }
      } finally {
        isApplying = false;
      }
    };

    applyTranslation(document.body);

    const observer = new MutationObserver((mutations) => {
      if (lang !== "mr" || isApplying) return;
      for (const m of mutations) {
        for (const added of Array.from(m.addedNodes)) {
          applyTranslation(added);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [lang, pathname]);

  return null;
}
