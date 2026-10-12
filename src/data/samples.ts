export const SAMPLES = {
  voice: {
    targetAudience: "Someone with under a thousand subscribers who has made 9 videos and cannot work out why none break 400 views.",
    howITalk: "I speak plain and direct. Short sentences. I pause after points. I don't hype up simple things. Here is a transcript line: 'So here is how to write a hook that works. First you name the viewer in the first six words.'",
    wordsNeverUse: "unlock, game-changer, dive in, let's get into it, smash that subscribe button, synergy, leverage",
    wordsDoUse: "look at the data, the mechanism, cliff, leak, cut it, ship it",
    wontClaim: "10x overnight growth, secret algorithm hacks, making millions in 3 days",
    format: "Talking head with rapid b-roll overlays, screen recordings with zoom-ins, 8-12 minutes, no intro music, straight into value."
  },

  script: {
    idea: "97% of creators quit before their 30th video. Why they drop off and the structural framework to make it to 100 videos.",
    title: "Why 97% of Creators Quit Before Video 30",
    lengthMinutes: "8"
  },

  package: {
    topic: "I Let an AI Run My YouTube Channel for 30 Days",
    initialThumb: "AI RAN IT"
  },

  edit: {
    transcript: `1
00:00:00,000 --> 00:00:03,000
So here is how to write a hook that works.

2
00:00:03,200 --> 00:00:04,000
um

3
00:00:05,500 --> 00:00:08,000
So here is how to write a hook that works.

4
00:00:08,100 --> 00:00:12,000
First you name the viewer in the first six words.

5
00:00:12,100 --> 00:00:16,000
Then you state a number that they did not know before.

6
00:00:19,000 --> 00:00:23,000
Now let us talk about thumbnails and the three word rule.

7
00:00:23,100 --> 00:00:27,000
Thumbnails with more than three words turn into a grey smear at feed size.

8
00:00:27,200 --> 00:00:31,000
Titles need a number or a name, never an adjective.

9
00:00:34,000 --> 00:00:38,000
Finally we cover descriptions and the first two lines above the fold.

10
00:00:38,100 --> 00:00:42,000
Search snippets use those first two lines so write them for a person.

11
00:00:42,100 --> 00:00:46,000
Tags barely matter, use them only for spellings and tool names.

12
00:00:47,000 --> 00:00:52,000
That is the whole workflow, ship it and check retention tomorrow.`
  },

  comment: {
    comments: `Can you do a tutorial on how to configure DaVinci Resolve to export chapters automatically?
Actually at 04:12 you mentioned 1080p bitrate is 12mbps, but YouTube recommends 16mbps for 60fps.
This video completely changed how I think about my first 15 seconds! Thank you so much!
Dude this advice is completely useless, you don't even have 100k subs yourself lol
What microphone are you using for this desk setup?
Another clickbait video with zero real value.`
  },

  plan: {
    hoursAvailable: "10",
    alreadyMade: "A script draft on title testing and 3 b-roll screen recordings of my analytics dashboard",
    bestDay: "Thursday",
    niche: "Tech tutorials & creator tooling",
    recentVideos: "1. Why 97% of Creators Quit (12k views)\n2. DaVinci Resolve Pacing Guide (4.2k views)"
  },

  viral: {
    jsonVideos: JSON.stringify([
      { channel: "Tech Creator A", views: 300000, title: "I Let an AI Run My Channel for 30 Days", url: "https://youtu.be/1" },
      { channel: "Tech Creator A", views: 20000, title: "Video two about editing workflow", url: "https://youtu.be/2" },
      { channel: "Tech Creator A", views: 25000, title: "Microphone setup for small desks", url: "https://youtu.be/3" },
      { channel: "Tech Creator A", views: 30000, title: "Lighting tutorial on a budget", url: "https://youtu.be/4" },
      { channel: "Tech Creator A", views: 65000, title: "97% of creators quit before video 30", url: "https://youtu.be/5" },
      { channel: "One Video Guy", views: 50000, title: "My only video", url: "https://youtu.be/6" }
    ], null, 2)
  },

  retention: {
    duration: 600,
    csv: `0,100
5,88
10,76
15,70
20,66
25,63
30,61
35,58
40,56
45,40
50,38
55,37
60,35
65,34
70,33
75,31
80,30
85,29
90,27
95,26`
  },

  shorts: {
    transcript: `1
00:00:00,000 --> 00:00:04,500
97% of the people who start a channel quit before video 30.

2
00:00:04,600 --> 00:00:09,000
Most people think it's because they ran out of ideas or the algorithm hates them.

3
00:00:09,200 --> 00:00:15,000
It isn't. The real problem is they spend 40 hours on editing and 2 minutes on the first 15 seconds.

4
00:00:15,100 --> 00:00:20,000
If nobody watches past 30 seconds, YouTube stops showing the video no matter how color-graded it is.

5
00:00:20,200 --> 00:00:25,500
Fix the first sentence before you touch a timeline, and you won't be in that 97%.`
  },

  seo: {
    title: "Why 97% of Creators Quit Before Video 30",
    topic: "YouTube creator burnout, video retention, hook formulas, channel growth",
    targetMode: "search"
  },

  chapters: {
    target: 3,
    transcript: `1
00:00:00,000 --> 00:00:03,000
So here is how to write a hook that works.

2
00:00:03,200 --> 00:00:04,000
um

3
00:00:05,500 --> 00:00:08,000
So here is how to write a hook that works.

4
00:00:08,100 --> 00:00:12,000
First you name the viewer in the first six words.

5
00:00:12,100 --> 00:00:16,000
Then you state a number that they did not know before.

6
00:00:19,000 --> 00:00:23,000
Now let us talk about thumbnails and the three word rule.

7
00:00:23,100 --> 00:00:27,000
Thumbnails with more than three words turn into a grey smear at feed size.

8
00:00:27,200 --> 00:00:31,000
Titles need a number or a name, never an adjective.

9
00:00:34,000 --> 00:00:38,000
Finally we cover descriptions and the first two lines above the fold.

10
00:00:38,100 --> 00:00:42,000
Search snippets use those first two lines so write them for a person.

11
00:00:42,100 --> 00:00:46,000
Tags barely matter, use them only for spellings and tool names.

12
00:00:47,000 --> 00:00:52,000
That is the whole workflow, ship it and check retention tomorrow.`
  },

  audit: {
    titles: `Why 97% of Creators Quit Before Video 30
I Let an AI Run My YouTube Channel for 30 Days
How to Edit Faster in DaVinci Resolve 19
The Secret to YouTube Growth in 2026
My Entire Desk Setup for YouTube Videos
Stop Making This 1 Mistake in Your Audio
10 Tools Every Creator Needs Right Now
Why Your Retention Drops at 30 Seconds
5 Thumbnail Mistakes Killing Your CTR
The Only Pacing Guide You Will Ever Need`,
    recentHooks: `1. 97% of the people who start a channel quit before video 30. Here is what the other 3% do differently.
2. I gave an AI complete control over my channel for thirty days, and this is what happened to my views.
3. If your videos keep dying at the 30-second mark, you are making this one mistake in your first sentence.`,
    uploadDates: `2026-09-01
2026-09-08
2026-09-15
2026-09-22
2026-09-29
2026-10-06`
  }
};
