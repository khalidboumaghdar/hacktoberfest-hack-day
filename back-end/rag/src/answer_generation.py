import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


def answer_generator(query: str, context: list[str]):
    # print("---------------------------------------------")
    # print(context)
    # exit()
    # print("---------------------------------------------")
    model_name = "Qwen/Qwen3-0.6B" 

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )

    

    context_text = "\n\n".join(context)
    content = f"""
    You are a factual assistant.

    Answer the user's question using only the information in the context.

    If the context does not contain the answer, say:
    I cannot find the answer in the provided documents.

    Context:
    {context_text}
    """
    messages = [
    {"role": "system", "content": content},
    {"role": "user", "content": query}
    ]
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
        enable_thinking=False
        )
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
    # newline_token_id = tokenizer.convert_tokens_to_ids("\n")
    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=500,
        # temperature=0.1,
        do_sample=False,
        # eos_token_id=newline_token_id
        )

    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]
    # print(generated_ids)
    # exit()

    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return response