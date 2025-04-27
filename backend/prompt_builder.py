def build_story_prompt(
    prompt, 
    genre=None, 
    style=None, 
    character=None,
    include_dialogue=True,
    include_description=True,
    story_length="medium"
):
    """
    Creates a tailored prompt for story generation
    """
    # Map story length to approximate word counts for clearer instructions
    length_descriptions = {
        "short": "a short story (around 300-500 words)",
        "medium": "a medium-length story (around 700-1000 words)",
        "long": "a complete, detailed story (around 1500-2000 words)"
    }
    
    length_desc = length_descriptions.get(story_length, length_descriptions["medium"])
    
    enhanced_prompt = f"Generate {length_desc} based on the following prompt: {prompt}"
    
    # Add genre specification
    if genre:
        enhanced_prompt += f"\nGenre: {genre}"
    
    # Add writing style
    if style:
        enhanced_prompt += f"\nWriting Style: {style}"
    
    # Add character details
    if character:
        enhanced_prompt += f"\nMain Character: {character}"
    
    # Add dialogue preference
    if include_dialogue:
        enhanced_prompt += "\nInclude natural dialogue between characters."
    
    # Add description preference
    if include_description:
        enhanced_prompt += "\nInclude vivid descriptions of settings and characters."
    
    # Add formatting instructions
    enhanced_prompt += "\n\nWrite a well-structured story with a beginning, middle, and end. Use paragraphs for readability."
    enhanced_prompt += "\nMake sure the story feels complete and has a satisfying conclusion."
    
    return enhanced_prompt
