type TopicKeySource = {
  id?: string;
  topicId?: string;
};

export const getTopicKey = (topic?: TopicKeySource): string | undefined => {
  if (!topic) {
    return undefined;
  }

  return topic.id ?? topic.topicId;
};
