import { http } from 'msw';

import { getApiBaseUrl } from '../api-base';
import { MOCK_PERSONA_ID, MOCK_USER_ID } from './fixtures';

function apiUrl(path: string): string {
  return `${getApiBaseUrl()}/${path.replace(/^\//, '')}`;
}

function encodeSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function encodePing(): string {
  return `: ping - ${new Date().toISOString()}\n\n`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_REPLY =
  '우울한 기분을 전환할 수 있는 영화를 추천해드릴게요. 아래는 우울감과 연결된 영화들입니다:\n\n' +
  '1. **언다큐먼티드 모나리자** (2026, 한국)  \n' +
  '2. **君が最後に遺した歌** (2026, 일본)  \n' +
  '3. **機動戦士ガンダム 閃光のハサウェイ キルケーの魔女** (2026, 일본)  \n' +
  '4. **그녀가 돌아온 날** (2026, 한국)  \n' +
  '5. **우리는 매일매일** (2026, 한국)  \n' +
  '6. **반칙왕 몽키** (2026, 한국)  \n' +
  '7. **미스매치** (2026, 한국)  \n' +
  '8. **리마인더스 오브 힘** (2026, 미국)  \n' +
  '9. **クスノキの番人** (2026, 일본)  \n' +
  '10. **첫 번째 키스** (2025, 일본)  \n\n' +
  '이 영화들은 우울한 감정을 표현하거나 깊은 내면을 탐구하는 작품들입니다. 만약 더 활기찬 분위기의 영화를 원하시면, "기분을 전환할 수 있는 영화" 또는 "흥분적인 영화"와 같은 키워드로 다시 검색해보세요! 😊';

const MOCK_RETRIEVED_MOVIES = [
  { movie_id: '92e542c8-a52a-46c6-93cc-185990980b51', producing_year: 2026, country: 'kr', title: '언다큐먼티드 모나리자' },
  { movie_id: '0abe8b63-a0fd-4e74-82a4-c604b543b73e', producing_year: 2026, country: 'jp', title: '君が最後に遺した歌' },
  { movie_id: 'd59321a6-f4cb-4eda-a689-6a6c65fb2db0', producing_year: 2026, country: 'jp', title: '機動戦士ガンダム 閃光のハサウェイ キルケーの魔女' },
  { movie_id: '9564ba22-9aa9-4299-97d7-cfe6394fb414', producing_year: 2026, country: 'kr', title: '그녀가 돌아온 날' },
  { movie_id: '915225e4-8754-4c1b-beb0-ca5f721027a0', producing_year: 2026, country: 'kr', title: '우리는 매일매일' },
  { movie_id: '2b474312-fd71-40e4-928b-76cf73a8c887', producing_year: 2026, country: 'kr', title: '반칙왕 몽키' },
  { movie_id: 'da696a46-fc3d-4481-a037-95785bf436a7', producing_year: 2026, country: 'kr', title: '미스매치' },
  { movie_id: 'd82c5afe-4a76-415b-81d5-2b2f1c4ee3a4', producing_year: 2026, country: 'us', title: '리마인더스 오브 힘' },
  { movie_id: 'b85cc92f-794e-440b-b88c-eb64a9b91f69', producing_year: 2026, country: 'jp', title: 'クスノキの番人' },
  { movie_id: 'f4fc5679-7def-49b7-b682-518f8e1662d4', producing_year: 2025, country: 'jp', title: '첫 번째 키스' },
];

const MOCK_MOVIE_LIST = [
  { id: '92e542c8-a52a-46c6-93cc-185990980b51', title: '언다큐먼티드모나리자', poster_url: null, release_date: null },
  { id: '0abe8b63-a0fd-4e74-82a4-c604b543b73e', title: '네가마지막으로남긴노래', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/27/tn_DPF032448.jpg', release_date: '20260401' },
  { id: 'd59321a6-f4cb-4eda-a689-6a6c65fb2db0', title: '기동전사건담섬광의하사웨이키르케의마녀', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/35/tn_DPF032936.jpg', release_date: '20260422' },
  { id: '9564ba22-9aa9-4299-97d7-cfe6394fb414', title: '그녀가돌아온날', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/31/tn_DPK025377.jpg', release_date: '20260506' },
  { id: '915225e4-8754-4c1b-beb0-ca5f721027a0', title: '우리는매일매일', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/29/tn_DPK025334.jpg', release_date: '20260304' },
  { id: '2b474312-fd71-40e4-928b-76cf73a8c887', title: '반칙왕몽키', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/35/tn_DPA002417.jpg', release_date: '20260520' },
  { id: 'da696a46-fc3d-4481-a037-95785bf436a7', title: '미스매치', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/31/tn_DPK025380.jpg', release_date: '20260423' },
  { id: 'd82c5afe-4a76-415b-81d5-2b2f1c4ee3a4', title: '리마인더스오브힘', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/36/tn_DPF033023.jpg', release_date: '20260527' },
  { id: 'b85cc92f-794e-440b-b88c-eb64a9b91f69', title: '녹나무의파수꾼', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/19/31/tn_DPF032686.jpg', release_date: '20260318' },
  { id: 'f4fc5679-7def-49b7-b682-518f8e1662d4', title: '첫번째키스', poster_url: 'http://file.koreafilm.or.kr/thm/02/99/18/72/tn_DPF030628.jpg', release_date: '20250226' },
];

const MOCK_MOVIE_IDS = MOCK_RETRIEVED_MOVIES.map((movie) => movie.movie_id);

/** `POST /chat/completions` SSE 스트림 mock */
export const chatStreamHandlers = [
  http.post(apiUrl('chat/completions'), async ({ request }) => {
    const body = (await request.json()) as { session_id?: string; message?: string };
    const sessionId = body.session_id ?? '81c1fd1b-7e89-42c6-ae50-0a53b753d065';
    const messageId = 241;
    const replyId = 242;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const enqueue = (chunk: string) => controller.enqueue(encoder.encode(chunk));

        enqueue(
          encodeSseEvent('open', {
            session_id: sessionId,
            message_id: messageId,
          }),
        );

        enqueue(
          encodeSseEvent('node', {
            embed_query: { query_embedding: [] },
          }),
        );

        for (let i = 0; i < 5; i += 1) {
          await sleep(150);
          enqueue(encodePing());
        }

        enqueue(
          encodeSseEvent('node', {
            agent: {
              messages: [
                "AIMessage(content='', tool_calls=[{'name': 'query_neo4j_graph', 'args': {'question': '우울한 기분을 전환할 수 있는 영화 추천해줘'}}])",
              ],
            },
          }),
        );

        await sleep(150);
        enqueue(encodePing());

        enqueue(
          encodeSseEvent('node', {
            neo4j_tools: {
              messages: [
                "ToolMessage(content='{\"status\": \"ok\", \"rows\": []}', name='query_neo4j_graph')",
              ],
              graph_query_results: [
                {
                  cypher:
                    "MATCH (m:Movie)-[:HAS_MOOD]->(md:Mood {name: 'melancholic'})\nRETURN m.movie_id AS movie_id, m.producing_year AS producing_year, m.country AS country, m.title AS title\nORDER BY m.producing_year DESC\nLIMIT 10",
                  rows: MOCK_RETRIEVED_MOVIES,
                },
              ],
              retrieved_movies: MOCK_RETRIEVED_MOVIES,
              intent_scope: 'movie',
            },
          }),
        );

        for (let i = 0; i < 3; i += 1) {
          await sleep(150);
          enqueue(encodePing());
        }

        enqueue(
          encodeSseEvent('node', {
            agent: {
              messages: [`AIMessage(content=${JSON.stringify(MOCK_REPLY)})`],
            },
          }),
        );

        for (let i = 0; i < 2; i += 1) {
          await sleep(150);
          enqueue(encodePing());
        }

        enqueue(
          encodeSseEvent('node', {
            generate_reply: {
              reply: MOCK_REPLY,
              feed_list: [],
              movie_list: MOCK_MOVIE_LIST,
            },
          }),
        );

        enqueue(
          encodeSseEvent('node', {
            persist_history: {
              ontology_ref: {
                intent_scope: 'movie',
                arm_id: null,
                themes: [],
                moods: [],
                retrieved_movies: MOCK_RETRIEVED_MOVIES,
                retrieved_feeds: [],
                movie_ids: MOCK_MOVIE_IDS,
              },
              reply_id: replyId
            },
          }),
        );

        enqueue(
          encodeSseEvent('done', {
            session_id: sessionId,
            message_id: messageId,
            user_id: MOCK_USER_ID,
            persona_id: MOCK_PERSONA_ID,
          }),
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),
];
