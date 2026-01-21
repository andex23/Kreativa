'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Category, Location, PrimaryPlatform } from '@/lib/types';
import { CATEGORIES, LOCATIONS } from '@/lib/constants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ProfileData {
    name: string;
    handle: string;
    platform: PrimaryPlatform;
    bio?: string;
    category?: Category;
}

export interface CategorizedProfile extends ProfileData {
    suggestedCategory: Category;
    suggestedLocation: Location;
    confidence: 'high' | 'medium' | 'low';
}

export interface ParsedFileResult {
    profiles: CategorizedProfile[];
    errors: string[];
}

// Parse CSV content
export async function parseCSV(content: string): Promise<ProfileData[]> {
    const lines = content.trim().split('\n');
    const profiles: ProfileData[] = [];

    // Try to detect header row
    const header = lines[0].toLowerCase();
    const hasHeader = header.includes('name') || header.includes('handle') || header.includes('username');
    const startIndex = hasHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV (handle quoted fields)
        const fields = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(f => f.replace(/^"|"$/g, '').trim()) || [];

        if (fields.length >= 2) {
            profiles.push({
                name: fields[0] || '',
                handle: fields[1]?.replace('@', '') || '',
                platform: detectPlatform(fields[2]) || 'Instagram',
                bio: fields[3] || '',
            });
        }
    }

    return profiles;
}

// Detect platform from text
function detectPlatform(text?: string): PrimaryPlatform | null {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (lower.includes('tiktok') || lower.includes('tik tok')) return 'TikTok';
    if (lower.includes('twitter') || lower.includes('x.com')) return 'Twitter';
    if (lower.includes('instagram') || lower.includes('ig')) return 'Instagram';
    return null;
}

// Keyword-based category detection (no AI required)
function detectCategory(text: string): Category {
    const lower = text.toLowerCase();

    // Photographers
    if (lower.includes('photo') || lower.includes('camera') || lower.includes('portrait') ||
        lower.includes('shoot') || lower.includes('visual')) {
        return 'Photographers';
    }

    // Fashion Designers
    if (lower.includes('fashion') || lower.includes('style') || lower.includes('design') ||
        lower.includes('cloth') || lower.includes('wear') || lower.includes('stylist')) {
        return 'Fashion Designers';
    }

    // Graphic Designers
    if (lower.includes('graphic') || lower.includes('logo') || lower.includes('brand') ||
        lower.includes('ui') || lower.includes('ux')) {
        return 'Graphic Designers';
    }

    // Digital Artists
    if (lower.includes('art') || lower.includes('paint') || lower.includes('draw') ||
        lower.includes('illustrat') || lower.includes('digital art')) {
        return 'Digital Artists';
    }

    // Videographers
    if (lower.includes('video') || lower.includes('film') || lower.includes('cinema') ||
        lower.includes('direct') || lower.includes('dp')) {
        return 'Videographers';
    }

    // Musicians - actually not in the categories, use Content Creators
    if (lower.includes('music') || lower.includes('song') || lower.includes('beat') ||
        lower.includes('producer')) {
        return 'Content Creators';
    }

    // Writers
    if (lower.includes('writ') || lower.includes('author') || lower.includes('poet') ||
        lower.includes('blog') || lower.includes('journal')) {
        return 'Writers';
    }

    // Default
    return 'Content Creators';
}

// Detect location from text
function detectLocation(text: string): Location {
    const lower = text.toLowerCase();

    if (lower.includes('lagos')) return 'Lagos';
    if (lower.includes('abuja')) return 'Abuja';
    if (lower.includes('port harcourt') || lower.includes('ph')) return 'Port Harcourt';
    if (lower.includes('ibadan')) return 'Ibadan';
    if (lower.includes('kano')) return 'Kano';
    if (lower.includes('enugu')) return 'Enugu';
    if (lower.includes('calabar')) return 'Calabar';
    if (lower.includes('benin')) return 'Benin City';
    if (lower.includes('kaduna')) return 'Kaduna';

    return 'Lagos'; // Default to Lagos
}

// Categorize profiles using keywords (no AI required)
export async function categorizeWithAI(profiles: ProfileData[]): Promise<CategorizedProfile[]> {
    return profiles.map(p => {
        const text = `${p.name} ${p.handle} ${p.bio || ''}`;
        const category = p.category || detectCategory(text);
        const location = detectLocation(text);

        return {
            ...p,
            suggestedCategory: category,
            suggestedLocation: location,
            confidence: 'medium' as const,
        };
    });
}

// Parse raw text using Gemini AI (Context-aware)
export async function parseRawTextWithAI(text: string): Promise<ProfileData[]> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is required');
    }

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Extract all social media profiles from the text below.
Return a JSON array of objects.
Each object must have:
- "name": Person's name (or handle if name missing)
- "handle": Username (remove @ symbol)
- "platform": "Instagram", "TikTok", or "Twitter". (Infer from context! e.g. if the list is titled "TikTok Faves", all are TikTok. If unsure, default to Instagram).
- "bio": Brief bio/description if available.
- "category": Infer a category (e.g. "Fashion Designers", "Photographers", "Content Creators") based on keywords.

Input Text:
"""
${text.slice(0, 30000)}
"""

Return ONLY the JSON array.`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        let rawProfiles;
        try {
            rawProfiles = JSON.parse(response);
        } catch (e) {
            // Fallback for messy JSON
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                rawProfiles = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Invalid JSON response from AI');
            }
        }

        if (!Array.isArray(rawProfiles)) {
            if (rawProfiles && typeof rawProfiles === 'object') {
                rawProfiles = [rawProfiles];
            } else {
                return [];
            }
        }

        // Validate and map
        return rawProfiles.map((p: any) => ({
            name: p.name || p.handle || 'Unknown',
            handle: (p.handle || '').replace('@', '').trim(),
            platform: (['Instagram', 'TikTok', 'Twitter'].includes(p.platform) ? p.platform : 'Instagram') as PrimaryPlatform,
            bio: p.bio || '',
            category: p.category
        })).filter((p: ProfileData) => p.handle && p.handle.length > 0);

    } catch (error: any) {
        // Fallback to Regex if Quota Exceeded (429) or other API errors
        if (error.message?.includes('429') || error.message?.includes('Quota') || error.message?.includes('Too Many Requests')) {
            console.warn('Gemini Quota Exceeded. Falling back to Regex parsing.');
            return parseRawTextWithRegex(text);
        }

        console.error('AI Text Parsing failed:', error);
        if (error.message?.includes('API key')) throw error;
        throw new Error(`AI Parse Error: ${error.message}`);
    }
}

// Fallback Regex Parser (Original logic)
function parseRawTextWithRegex(text: string): ProfileData[] {
    const profiles: ProfileData[] = [];
    let currentCategory: Category = 'Content Creators';

    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lineCount = normalized.split('\n').filter(l => l.trim()).length;
    let entries: string[] = (lineCount <= 5 && normalized.includes(' - '))
        ? normalized.split(/ - /)
        : normalized.split('\n');

    for (const entry of entries) {
        const trimmed = entry.trim();
        if (!trimmed) continue;

        const lowerTrimmed = trimmed.toLowerCase();
        let isHeader = false;

        // Simple category detection
        if (lowerTrimmed.includes('visual artists') || lowerTrimmed.includes('photographers')) { currentCategory = 'Photographers'; isHeader = true; }
        else if (lowerTrimmed.includes('fashion designers') || lowerTrimmed.includes('stylists')) { currentCategory = 'Fashion Designers'; isHeader = true; }
        else if (lowerTrimmed.includes('digital content') || lowerTrimmed.includes('creatives')) { currentCategory = 'Content Creators'; isHeader = true; }

        if (isHeader && !trimmed.includes('@')) continue;
        if (!trimmed.includes('@')) continue;

        const handleMatches = trimmed.match(/@([a-zA-Z0-9_\.]+)/g);
        if (!handleMatches) continue;
        const handle = handleMatches[0].replace('@', '');

        // Simple Platform Detection
        let platform: PrimaryPlatform = 'Instagram';
        if (lowerTrimmed.includes('tiktok')) platform = 'TikTok';
        else if (lowerTrimmed.includes('twitter') && !lowerTrimmed.includes('ig')) platform = 'Twitter';

        // Extract Name
        let name = '';
        const colonMatch = trimmed.match(/^[•\-\*]?\s*([^:@]+):/);
        if (colonMatch) name = colonMatch[1].trim();
        else {
            const beforeAt = trimmed.split('@')[0];
            name = beforeAt.replace(/^[•\-\*\d\.]+\s*/, '').replace(/\(.*?\)/g, '').trim();
        }
        name = name.replace(/[:,\-]$/, '').trim();
        if (!name || name.length < 2 || name.toLowerCase().includes('creators')) name = handle;

        // Extract Bio
        const bio = (trimmed.split(handleMatches[0])[1] || '')
            .replace(/^\s*[\(\[\{]?/i, '').replace(/[\)\]\}]?\s*$/i, '')
            .replace(/^(IG|TikTok|Twitter|\/)+/gi, '').replace(/^\s*[-:,]+\s*/, '').trim();

        profiles.push({ name, handle, platform, bio, category: currentCategory });
    }
    return profiles;
}

// Parse PDF content using Gemini Vision
export async function parsePDFWithAI(base64Data: string): Promise<ProfileData[]> {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
        throw new Error('Gemini API key required for PDF parsing');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Extract all creative profiles from this document.

For each person/creative found, extract:
- name: Full name
- handle: Social media username (without @)
- platform: Instagram, TikTok, or Twitter
- bio: Brief description if available

Return as JSON array:
[{"name": "...", "handle": "...", "platform": "Instagram|TikTok|Twitter", "bio": "..."}]

If you can't find structured profiles, try to identify any names with associated social handles.
Return empty array [] if no profiles found.`;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: base64Data,
                },
            },
        ]);

        const response = result.response.text();
        const jsonMatch = response.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            const profiles = JSON.parse(jsonMatch[0]) as ProfileData[];
            return profiles.map(p => ({
                name: p.name || '',
                handle: (p.handle || '').replace('@', ''),
                platform: (['Instagram', 'TikTok', 'Twitter'].includes(p.platform)
                    ? p.platform
                    : 'Instagram') as PrimaryPlatform,
                bio: p.bio || '',
            }));
        }

        return [];
    } catch (error) {
        console.error('PDF parsing failed:', error);
        throw new Error('Failed to parse PDF. Please try a CSV file instead.');
    }
}

// Main function to process file upload
export async function processFileUpload(
    fileContent: string,
    fileType: 'csv' | 'pdf'
): Promise<ParsedFileResult> {
    const errors: string[] = [];
    let profiles: ProfileData[] = [];

    try {
        if (fileType === 'csv') {
            profiles = await parseCSV(fileContent);
        } else if (fileType === 'pdf') {
            profiles = await parsePDFWithAI(fileContent);
        }

        if (profiles.length === 0) {
            errors.push('No profiles found in the file');
            return { profiles: [], errors };
        }

        // Categorize with AI
        const categorized = await categorizeWithAI(profiles);

        return { profiles: categorized, errors };
    } catch (error) {
        errors.push(error instanceof Error ? error.message : 'Unknown error');
        return { profiles: [], errors };
    }
}
