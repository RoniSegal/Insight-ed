# Prompts Service

This service manages AI prompts used in student analysis, loading them from text files for better Hebrew encoding and easier editing.

## Structure

```
prompts/
├── prompts.service.ts       # Service that loads and serves prompts
├── prompts.module.ts         # Module definition
└── templates/                # Text files containing Hebrew prompts
    ├── system-prompt.txt     # Main system instructions for AI
    ├── questions.txt         # 6 questions (one per line)
    └── analysis-prompt.txt   # Final analysis template
```

## Editing Prompts

### For Developers
1. Edit the `.txt` files in `src/prompts/templates/`
2. Save with UTF-8 encoding (your IDE should handle this automatically)
3. Rebuild: `npm run build`
4. The files are automatically copied to `dist/prompts/templates/`

### For Non-Developers
1. Open the `.txt` files in any text editor that supports Hebrew
2. Make your changes
3. Save the file
4. Restart the application

## Best Practices for Hebrew Text

### In Your IDE (Cursor/VS Code)
- **Encoding**: Files are saved as UTF-8 (check bottom-right corner)
- **Font**: Use JetBrains Mono, Fira Code, or Consolas for best Hebrew rendering
- **Settings**: Add to `.vscode/settings.json`:
  ```json
  {
    "editor.unicodeHighlight.ambiguousCharacters": false,
    "editor.fontFamily": "'JetBrains Mono', monospace"
  }
  ```

### File Format
- **system-prompt.txt**: Full system instructions with placeholders like `{studentName}`
- **questions.txt**: One question per line (6 lines total)
- **analysis-prompt.txt**: Template for final analysis output

## How It Works

1. **Initialization**: When the NestJS module starts, `PromptsService.onModuleInit()` loads all templates
2. **Runtime**: The service provides methods to access the loaded templates:
   - `getSystemPrompt(studentName)` - Returns system prompt with student name
   - `getQuestionTemplates()` - Returns array of 6 questions
   - `getAnalysisPrompt()` - Returns analysis template
3. **Build**: The `nest-cli.json` config ensures `.txt` files are copied to `dist/`

## Benefits of This Approach

✅ **Better Encoding**: Text files preserve Hebrew characters perfectly  
✅ **Easy Editing**: Non-developers can edit prompts without touching code  
✅ **Version Control**: Changes to prompts are tracked in git  
✅ **IDE Friendly**: Text files render Hebrew better than TypeScript strings  
✅ **Hot Reload**: In dev mode, changes are picked up automatically  

## Future Enhancements (Phase 2)

- Store prompts in database with versioning
- A/B testing different prompt variations
- Admin UI for editing prompts
- Prompt analytics and effectiveness tracking
