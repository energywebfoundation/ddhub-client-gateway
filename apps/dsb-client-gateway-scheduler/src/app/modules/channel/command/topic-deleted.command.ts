export class TopicDeletedCommand {
  constructor(
    public readonly topicName: string,
    public readonly topicOwner: string,
    public readonly topicId: string
  ) {}
}
