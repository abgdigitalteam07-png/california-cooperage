'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (opts: { portalId: string; formId: string; region: string; target: string }) => void;
      };
    };
  }
}

export default function DealerForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const containerId = 'hs-dealer-form';

    const init = () => {
      if (window.hbspt && document.getElementById(containerId)) {
        window.hbspt.forms.create({
          portalId: '358916',
          formId: 'db51bd40-146b-4182-a875-6b86dcd08fb2',
          region: 'na2',
          target: `#${containerId}`,
        });
      }
    };

    if (window.hbspt) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = '//js-na2.hsforms.net/forms/embed/v2.js';
      script.charset = 'utf-8';
      script.type = 'text/javascript';
      script.onload = init;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef}>
      <div id="hs-dealer-form" />
    </div>
  );
}
