def build_story_prompt(prompt, genre=None, style=None, character=None):
    parts = []
    if genre:
        parts.append(f"In a {genre.lower()} world,")
    if style:
        parts.append(f"in a {style.lower()} style,")
    if character:
        parts.append(f"there was a {character.lower()} who")
    # Combine crafted parts and user prompt
    story_seed = " ".join(parts)
    if story_seed:
        # Add user prompt, with correct grammar
        if not prompt.lower().startswith("who") and not prompt.lower().startswith("what"):
            story_seed += " " + prompt
        else:
            story_seed += " " + prompt.capitalize()
        return story_seed
    else:
        return prompt