export class WorkflowEvent {
  constructor(
    public readonly applicationId: string,
    public readonly type: string,
    public readonly payload?: any,
  ) {}
}
