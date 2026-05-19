import { useMemo } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

type TrailerVideoProps = {
  videoId: string;
  youtubeUrl: string;
};

function buildEmbedUri(videoId: string, youtubeUrl: string) {
  const q = new URLSearchParams({
    autoplay: '1',
    /** 모바일·데스크톱 자동재생 정책 대응 (사용자가 음소거 해제 가능) */
    mute: '1',
    playsinline: '1',
    controls: '0',
    showinfo: '0',
    rel: '0',
    ...(Platform.OS === 'ios' ? { origin: 'https://www.youtube.com' } : {}),
  });
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${q.toString()}`;
}

export function TrailerVideo({ videoId, youtubeUrl }: TrailerVideoProps) {
  const uri = useMemo(() => buildEmbedUri(videoId, youtubeUrl), [videoId, youtubeUrl]);
  if (Platform.OS === 'web') {
    return <View className="max-h-[420px] flex justify-center items-center overflow-hidden rounded-2xl bg-black">
      <iframe
        src={uri}
        allow="accelerometer; autoplay; modestbranding; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="bg-black h-full aspect-video max-w-80vw"
      />
    </View>
  }
  return (
    <View className="h-[420px] flex justify-center items-center overflow-hidden rounded-2xl bg-black">
      <WebView
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        androidLayerType="hardware"
        className="bg-black h-full aspect-video max-w-80vw"
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        setSupportMultipleWindows={false}
        source={{ uri }}
      />
    </View>
  );
}
