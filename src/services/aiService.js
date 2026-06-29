import { htmlToText } from 'html-to-text';
import nlp from 'compromise';
import writeGood from 'write-good';
import rs from 'text-readability';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cleanText = (content) => {
  if (typeof content !== 'string') return '';

  return htmlToText(content, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
    ],
  }).replace(/\s+/g, ' ').trim();
};

const getReadingTime = (wordCount) => {
  const wpm = 200;
  const minutes = wordCount / wpm;
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
};

export const summarizeArticle = async (content) => {
  await delay(1500);
  const text = cleanText(content);
  if (!text || text.length < 50) {
    return 'This article discusses key insights and practical applications.';
  }

  const doc = nlp(text);
  const sentences = doc.sentences().json();

  if (sentences.length === 0) {
    return 'This article discusses key insights and practical applications.';
  }

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = {};
  words.forEach((w) => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  const scored = sentences.map((sent) => {
    const sentWords = sent.text.toLowerCase().match(/\b\w+\b/g) || [];
    const score =
      sentWords.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) /
      (sentWords.length || 1);
    return { text: sent.text, score, index: sent.index || 0 };
  });

  const topTwo = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index);

  return topTwo.map((s) => s.text).join('. ') + '.';
};

export const getWritingSuggestions = async (content) => {
  await delay(1200);

  const text = cleanText(content);
  const isShort = text.length < 300;

  let writeGoodSuggestions = [];
  try {
    writeGoodSuggestions = writeGood(text).map(
      (issue) => `${issue.reason} (near: "${issue.string}")`
    );
  } catch (e) {
    writeGoodSuggestions = [];
  }

  const suggestions = [
    ...writeGoodSuggestions.slice(0, 2),
    isShort
      ? 'Expand on your main ideas by adding more context or details.'
      : 'Consider adding a concrete example or data point after the second paragraph.',
    'The introduction could be more punchy—try starting with a question.',
    'Add a call-to-action at the end to drive engagement.',
  ];

  return suggestions.slice(0, 3);
};

export const checkGrammarAndReadability = async (content) => {
  await delay(1000);

  const text = cleanText(content);

  if (!text) {
    return {
      score: 0,
      grade: 'N/A',
      readingTime: '0 min',
      suggestions: ['Add more content to analyze.'],
      stats: {
        wordCount: 0,
        sentenceCount: 0,
        avgWordsPerSentence: 0,
        readingTimeMinutes: 0,
      },
    };
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentenceArray = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = sentenceArray.length;

  const avgWordsPerSentence =
    sentenceCount > 0 ? Number((wordCount / sentenceCount).toFixed(1)) : 0;

  let fleschScore = 0;
  let fkGrade = 0;
  let ariScore = 0;
  let sylCount = 0;

  try {
    fleschScore = Number(rs.fleschReadingEase(text)) || 0;
  } catch (e) {
    fleschScore = 0;
  }
  try {
    fkGrade = Number(rs.fleschKincaidGrade(text)) || 0;
  } catch (e) {
    fkGrade = 0;
  }
  try {
    ariScore = Number(rs.automatedReadabilityIndex(text)) || 0;
  } catch (e) {
    ariScore = 0;
  }
  try {
    sylCount = Number(rs.syllableCount(text)) || 0;
  } catch (e) {
    sylCount = 0;
  }

  fleschScore = isFinite(fleschScore) ? fleschScore : 0;
  fkGrade = isFinite(fkGrade) ? fkGrade : 0;
  ariScore = isFinite(ariScore) ? ariScore : 0;
  let grade = 'N/A';
  if (fleschScore >= 90) grade = 'Grade 5 (Very Easy)';
  else if (fleschScore >= 80) grade = 'Grade 6 (Easy)';
  else if (fleschScore >= 70) grade = 'Grade 7 (Fairly Easy)';
  else if (fleschScore >= 60) grade = 'Grade 8-9 (Standard)';
  else if (fleschScore >= 50) grade = 'Grade 10-12 (Fairly Difficult)';
  else if (fleschScore >= 30) grade = 'College (Difficult)';
  else if (fleschScore > 0) grade = 'College Graduate (Very Difficult)';

  const score = Math.min(100, Math.max(0, Math.round(fleschScore)));

  const readingTime = getReadingTime(wordCount);
  const readingTimeMinutes = Number((wordCount / 200).toFixed(1));

  const suggestions = [];

  if (avgWordsPerSentence > 20) {
    suggestions.push('Try breaking down long sentences for better readability.');
  } else {
    suggestions.push('Sentence length is optimal.');
  }

  if (fkGrade > 12) {
    suggestions.push(
      'Text complexity is high—consider simplifying vocabulary for general audiences.'
    );
  }

  let passiveIssues = [];
  try {
    passiveIssues = writeGood(text).filter((i) =>
      i.reason.includes('passive')
    );
  } catch (e) {
  }
  if (passiveIssues.length > 0) {
    suggestions.push(
      `Avoid passive voice (${passiveIssues.length} instance${
        passiveIssues.length > 1 ? 's' : ''
      } found).`
    );
  }

  return {
    score,
    grade,
    readingTime,
    suggestions: suggestions.slice(0, 3),
    stats: {
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      readingTimeMinutes,
      syllableCount: sylCount,
      fleschReadingEase: Number(fleschScore.toFixed(1)),
      fleschKincaidGrade: Number(fkGrade.toFixed(1)),
      automatedReadabilityIndex: Number(ariScore.toFixed(1)),
    },
  };
};