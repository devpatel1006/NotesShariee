import Groq from 'groq-sdk';
import { GlossaryTerm, GrammarIssue } from '../types';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class AIService {
  static async generateSummary(content: string): Promise<string> {
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.trim().length < 10) {
      return 'Note is too short to summarize.';
    }

    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes notes. Provide a concise, one-sentence summary of the following note content:',
          },
          {
            role: 'user',
            content: plainText,
          },
        ],
        max_tokens: 60,
      });
      return response.choices[0].message.content || 'Could not generate summary.';
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Error generating summary.';
    }
  }

  static async suggestTags(content: string): Promise<string[]> {
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.trim().length < 10) {
      return [];
    }

    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that suggests tags for notes. Based on the note content, suggest 3-5 relevant tags as a single, comma-separated string (e.g., "work, project, important"). Do not add any extra text or explanations.',
          },
          {
            role: 'user',
            content: plainText,
          },
        ],
        max_tokens: 20,
      });

      const tagsString = response.choices[0].message.content;
      if (tagsString) {
        return tagsString.split(',').map(tag => tag.trim().toLowerCase());
      }
      return [];
    } catch (error) {
      console.error('Error suggesting tags:', error);
      return [];
    }
  }

  static async findGlossaryTerms(content: string): Promise<GlossaryTerm[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const terms: GlossaryTerm[] = [];
    const glossary = {
      'API': 'Application Programming Interface - a set of protocols for building software applications',
      'JWT': 'JSON Web Token - a compact way to securely transmit information between parties',
      'MongoDB': 'A document-oriented NoSQL database program',
      'React': 'A JavaScript library for building user interfaces',
      'encryption': 'The process of converting information into a secret code',
      'algorithm': 'A set of rules or instructions for solving a problem'
    };

    Object.entries(glossary).forEach(([term, definition]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        terms.push({
          term,
          definition,
          startIndex: match.index,
          endIndex: match.index + term.length
        });
      }
    });

    return terms;
  }

  static async checkGrammar(content: string): Promise<GrammarIssue[]> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const plainText = content.replace(/<[^>]*>/g, '');
    const issues: GrammarIssue[] = [];
    
    // Simple grammar and spelling checks
    const commonMistakes = {
      'teh': { correct: 'the', type: 'spelling' as const },
      'recieve': { correct: 'receive', type: 'spelling' as const },
      'seperate': { correct: 'separate', type: 'spelling' as const },
      'definately': { correct: 'definitely', type: 'spelling' as const },
      'its a': { correct: "it's a", type: 'grammar' as const }
    };

    Object.entries(commonMistakes).forEach(([mistake, correction]) => {
      const regex = new RegExp(`\\b${mistake}\\b`, 'gi');
      let match;
      while ((match = regex.exec(plainText)) !== null) {
        issues.push({
          text: mistake,
          suggestion: correction.correct,
          startIndex: match.index,
          endIndex: match.index + mistake.length,
          type: correction.type
        });
      }
    });

    return issues;
  }
}