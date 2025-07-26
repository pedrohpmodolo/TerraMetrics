import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Country } from './world-bank';
import { SavedItem } from './dashboard'; 
import { environment } from '../../environments/environment.development';

// Interface for a chat message
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiAnalysisService {
  // --- IMPORTANT: Replace with your actual OpenAI API key ---
  private apiKey = environment.openAiApiKey; 
  private apiUrl = "https://api.openai.com/v1/chat/completions";

  constructor(private http: HttpClient) { }

  getEconomicComparison(country1: Country, country2: Country): Observable<string> {
    const prompt = `
      Provide a concise economic comparison between ${country1.name} and ${country2.name}.
      Focus on key indicators like GDP, inflation, and population growth.
      Present the comparison in a clear, easy-to-read format using Markdown for formatting.
      Start with a clear heading. Do not include any introductory or concluding sentences outside of the main comparison.
    `;
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    return from(this.callChatGptApi(messages));
  }

  getFollowUpAnswer(messages: ChatMessage[]): Observable<string> {
    return from(this.callChatGptApi(messages));
  }

  getDashboardSuggestion(savedItems: SavedItem[], question: string): Observable<string> {
    const chartSummary = savedItems.map(item => 
      item.type === 'country' 
        ? item.country.name 
        : `${item.country.name} - ${item.indicator?.name}`
    ).join(', ');

    const prompt = `
      Based on the user's current dashboard which includes items for: ${chartSummary}.
      The user is asking the following question: "${question}".
      Provide a thoughtful and relevant answer. If they ask for recommendations, suggest a few specific countries or economic indicators they might find interesting and briefly explain why.
    `;
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    return from(this.callChatGptApi(messages));
  }

  private async callChatGptApi(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey || this.apiKey === "YOUR_CHATGPT_API_KEY_HERE") {
      return "Error: Please provide a valid OpenAI API key in the ai-analysis.service.ts file.";
    }
    const payload = { model: "gpt-3.5-turbo", messages: messages };
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) { 
        const errorBody = await response.json();
        console.error("API Error Body:", errorBody);
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const result = await response.json();
      if (result.choices && result.choices.length > 0) {
        return result.choices[0].message.content;
      } else {
        return "Could not retrieve a valid response from the AI.";
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "An error occurred while contacting the AI analysis service.";
    }
  }
}
