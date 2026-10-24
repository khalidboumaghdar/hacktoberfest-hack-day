import torch

print("PyTorch:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
print("PyTorch CUDA:", torch.version.cuda)

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    print("VRAM:", round(
        torch.cuda.get_device_properties(0).total_memory / 1024**3, 2
    ), "GB")

    x = torch.randn(2000, 2000, device="cuda")
    y = x @ x
    print("GPU computation: OK")
else:
    print("PyTorch cannot access CUDA")


print("Device map:", model.hf_device_map)
print("GPU memory allocated:",
      round(torch.cuda.memory_allocated(0) / 1024**3, 2), "GB") 