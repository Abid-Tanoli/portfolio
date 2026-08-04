export function TechStackPills({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {stack.slice(0, 8).map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {tech}
        </span>
      ))}
      {stack.length > 8 && (
        <span className="inline-flex items-center px-1 font-mono text-[11px] text-muted-foreground">
          {`+${stack.length - 8} more`}
        </span>
      )}
    </div>
  );
}
