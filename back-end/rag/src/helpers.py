def validate_number(max_val: int, max_chunk_size: int) -> int:

    # if max_chunk_size is None:
    #     max_chunk_size = 5
    
    if 0 < max_chunk_size > max_val:
        raise ValueError(f"{max_chunk_size=} should be more thatn 0 and less than or equal {max_val}")
        
    return max_chunk_size