/** Small bar shown on top of every demo build. Plain <a> links on purpose (full page load keeps styles isolated). */
export function DemoBar({ concept, caseStudy }: { concept: string; caseStudy: string }) {
  return (
    <div className="iss-demobar" role="note">
      <span>
        Demo build by <b>ISSolutionAgency</b> · {concept}
      </span>
      <a href={caseStudy}>View case study</a>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full page load on purpose */}
      <a href="/">Back to ISSolutionAgency</a>
    </div>
  );
}
