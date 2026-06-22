const steps = [
  "Monthly request created",
  "Client opens secure link",
  "Client uploads to Drive / SharePoint",
  "Client marks checklist item submitted",
  "Bookkeeper verifies or requests again",
  "Tracker powers reminders and summaries"
];

export function WorkflowMap() {
  return (
    <div className="grid grid-3">
      {steps.map((step, index) => (
        <article className="card" key={step}>
          <p>Step {index + 1}</p>
          <h3>{step}</h3>
          <p>This stage can be implemented with low-code first, then extended with APIs or custom code if needed.</p>
        </article>
      ))}
    </div>
  );
}
