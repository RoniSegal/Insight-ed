import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  console.log('Testing OpenAI API connection...\n');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for testing API connectivity.',
        },
        {
          role: 'user',
          content: 'Say "API connection successful!" if you can read this.',
        },
      ],
      max_tokens: 50,
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', completion.choices[0].message.content);
    console.log('\nAPI Details:');
    console.log('- Model:', completion.model);
    console.log('- Tokens used:', completion.usage?.total_tokens);
    console.log('\n✅ OpenAI API is configured correctly!\n');
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
    if (error.message.includes('API key')) {
      console.error('\n❌ Check your OPENAI_API_KEY in .env or .env.local');
      console.error('💡 For now, using placeholder is OK - real key needed for Day 2 AI work\n');
    } else {
      console.error('\n❌ Unexpected error - check OpenAI service status\n');
    }
    process.exit(1);
  }
}

testOpenAI();
