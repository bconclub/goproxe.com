'use client';

import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { track } from '../../lib/analytics';

/** Accordion for comparison page FAQs. One open at a time. */
export default function ComparisonFaq({
  slug,
  items,
}: {
  slug: string;
  items: Array<{ q: string; a: string }>;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="indp-faq">
      {items.map((item, i) => (
        <div key={i} className="indp-faq-item" data-open={open === i}>
          <button
            type="button"
            className="indp-faq-q"
            aria-expanded={open === i}
            onClick={() => {
              const next = open === i ? null : i;
              setOpen(next);
              if (next !== null) track('faq_open', { question: item.q, comparison: slug });
            }}
          >
            {item.q}
            <FiPlus size={18} />
          </button>
          <div className="indp-faq-a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
