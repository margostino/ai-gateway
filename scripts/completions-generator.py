import json
import os
import random
import time

import requests
from dotenv import load_dotenv

load_dotenv()

max_completions = -100
# url = 'https://api.openai.com/v1/chat/completions'
base_url = 'http://localhost:8080'
weighted_path = {
  'openai/v1/chat/completions': 0.85,
  'openai/v1/models': 0.05,
  'openai/v1/embeddings': 0.1,
}
# api_key = os.environ.get('OPENAI_API_KEY')
api_key = os.environ.get('AI_GATEWAY_API_KEY')

headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + api_key
}

output_prompt = "Respond in 1-2 sentences."
weighted_models = {
  "gpt-3.5-turbo": 0.3,
  "gpt-3.5-turbo-16k": 0.05,
  "gpt-4": 0.649,
  "invalid-model": 0.001
}
models = [model for model in weighted_models.keys()]
weights = [weight for weight in weighted_models.values()]
questions = [
  "What is the meaning of life?",
  "Is there life on Mars?",
  "Is the universe infinite?",
  "What existed before the Big Bang?",
  "Is the universe deterministic or indeterministic?",
  "What is the nature of consciousness?",
  "If the universe is indeed expanding, what is it expanding into?",
  "Is time travel theoretically possible given our understanding of the universe's physical laws?",
  "Given the existence of black holes, is there a possibility of other dimensions or realities?"
]
inputs_for_embedding = [
  "Climate change refers to long-term shifts in weather patterns and average temperatures of the Earth's surface",
  "Climate change is a change in the usual weather found in a place",
  "Climate change is a long-term shift in global or regional climate patterns",
  "Climate change is a change in the usual weather found in a place",
  "Climate change is a long-term shift in global or regional climate patterns",
  "Climate change is a change in the usual weather found in a place",
]


def build_payload(url: str):
  if 'embeddings' in url:
    return {
      "model": 'text-embedding-ada-002',
      "input": random.choice(inputs_for_embedding)
    }
  else:
    question = random.choice(questions)
    return {
      "model": random.choices(models, weights=weights, k=1)[0],
      "messages": [
        {
          "role": "user",
          "content": question + "\n" + output_prompt
        }
      ]
    }


while (True and max_completions < 0) or max_completions > 0:
  path = random.choices(list(weighted_path.keys()), weights=list(weighted_path.values()), k=1)[0]
  url = f"{base_url}/{path}"

  if 'v1/models' in path:
    response = requests.get(url=url,
                            headers=headers)
  else:
    payload = build_payload(url)
    response = requests.post(url=url,
                             headers=headers,
                             data=json.dumps(payload))
  max_completions -= 1
  print(response.json())
  time.sleep(random.randint(1, 2))
