import { describe, it, expect } from "vitest";
import { score } from "@/lib/tools/hookscore";
import { checkTitle } from "@/lib/tools/title";
import { computeDeadAir, parseTranscript } from "@/lib/tools/deadair";
import { computeChapters } from "@/lib/tools/chapters";
import { computeRetention, parseRetentionCsv } from "@/lib/tools/retention";
import { analyzeOutliers } from "@/lib/tools/swipe";
import hooksData from "@/data/hooks.json";

describe("Golden Tests (§8 Port Verification)", () => {
  it("8.1 hookscore golden vectors", () => {
    // Vector 1
    const h1 = "97% of the people who start a channel quit before video 30. Here is what the other 3% do differently.";
    const r1 = score(h1);
    expect(r1.properties.SPECIFICITY).toBe(96);
    expect(r1.properties.ADDRESS).toBe(26);
    expect(r1.properties.STAKES).toBe(88);
    expect(r1.properties.CURIOSITY).toBe(58);
    expect(r1.properties.BREVITY).toBe(100);
    expect(r1.verdict).toBe(55);
    expect(r1.band).toBe("WORKABLE");
    expect(r1.formula).toBe("The Statistic");

    // Vector 2
    const h2 = "If you have under a thousand subscribers, you are probably making this one mistake before you upload.";
    const r2 = score(h2);
    expect(r2.properties.SPECIFICITY).toBe(34);
    expect(r2.properties.ADDRESS).toBe(100);
    expect(r2.properties.STAKES).toBe(48);
    expect(r2.properties.CURIOSITY).toBe(41);
    expect(r2.properties.BREVITY).toBe(100);
    expect(r2.verdict).toBe(52);
    expect(r2.band).toBe("WEAK");
    expect(r2.formula).toBe("The Mistake");

    // Vector 3
    const h3 = "Hey guys welcome back to my channel today we are going to talk about some really amazing tips";
    const r3 = score(h3);
    expect(r3.properties.SPECIFICITY).toBe(0);
    expect(r3.properties.ADDRESS).toBe(26);
    expect(r3.properties.STAKES).toBe(22);
    expect(r3.properties.CURIOSITY).toBe(24);
    expect(r3.properties.BREVITY).toBe(100);
    expect(r3.verdict).toBe(21);
    expect(r3.band).toBe("WEAK");
    expect(r3.formula).toBe("Unclassified");
  });

  it("8.2 title golden vectors", () => {
    // Vector 1
    const t1 = "I Let an AI Run My YouTube Channel for 30 Days";
    const thumb1 = "AI RAN IT";
    const r1 = checkTitle(t1, thumb1);
    expect(r1.chars).toBe(46);
    expect(r1.score).toBe(80);
    const issueKeys1 = r1.issues.map(i => i[0]);
    expect(issueKeys1).toContain("mobile");
    expect(issueKeys1).toContain("duplicate");
    const dupIssue1 = r1.issues.find(i => i[0] === "duplicate");
    expect(dupIssue1?.[1]).toContain("ai");
    expect(r1.good.some(g => g.includes("30"))).toBe(true);

    // Vector 2
    const t2 = "AI Channel Experiment: Results Inside";
    const thumb2 = "AI Channel Results";
    const r2 = checkTitle(t2, thumb2);
    expect(r2.chars).toBe(37);
    expect(r2.score).toBe(76);
    const issueKeys2 = r2.issues.map(i => i[0]);
    expect(issueKeys2).toContain("no-number");
    expect(issueKeys2).toContain("duplicate");
    const dupIssue2 = r2.issues.find(i => i[0] === "duplicate");
    expect(dupIssue2?.[1]).toContain("ai");
    expect(dupIssue2?.[1]).toContain("channel");
    expect(dupIssue2?.[1]).toContain("results");
  });

  it("8.3 swipe golden vectors", () => {
    const data = [
      { channel: "channel A", views: 300000, title: "I Let an AI Run My Channel for 30 Days", url: "https://youtu.be/1" },
      { channel: "channel A", views: 20000, title: "Video two", url: "https://youtu.be/2" },
      { channel: "channel A", views: 25000, title: "Video three", url: "https://youtu.be/3" },
      { channel: "channel A", views: 30000, title: "Video four", url: "https://youtu.be/4" },
      { channel: "channel A", views: 65000, title: "97% of creators quit before video 30", url: "https://youtu.be/5" },
      { channel: "channel B", views: 50000, title: "One video", url: "https://youtu.be/6" },
    ];

    const result = analyzeOutliers(data, 2.0);
    expect(result.skipped_thin_channels).toEqual([["channel B", 1]]);
    expect(result.outliers).toHaveLength(2);

    expect(result.outliers[0].median).toBe(30000);
    expect(result.outliers[0].multiple).toBe(10.0);
    expect(result.outliers[0].formula).toBe("I Tried It");

    expect(result.outliers[1].median).toBe(30000);
    expect(result.outliers[1].multiple).toBe(2.17);
    expect(result.outliers[1].formula).toBe("The Statistic");
  });

  it("8.4 retention golden vectors", () => {
    const csv = `0,100
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
95,26`;

    const rows = parseRetentionCsv(csv);
    const result = computeRetention(rows, 600);

    expect(result.hook_leak).toBe(12.0);
    expect(result.end).toBe(26.0);
    expect(result.cliffs).toHaveLength(5);
    expect(result.cliffs[0]).toEqual({
      from: 40.0,
      to: 45.0,
      lost: 16.0,
      at_seconds: 240.0,
    });
    expect(result.cliffs[1]).toEqual({
      from: 5.0,
      to: 10.0,
      lost: 12.0,
      at_seconds: 30.0,
    });
    expect(result.cliffs[2]).toEqual({
      from: 0.0,
      to: 5.0,
      lost: 12.0,
      at_seconds: 0.0,
    });
    expect(result.cliffs[3]).toEqual({
      from: 10.0,
      to: 15.0,
      lost: 6.0,
      at_seconds: 60.0,
    });
    expect(result.cliffs[4]).toEqual({
      from: 15.0,
      to: 20.0,
      lost: 4.0,
      at_seconds: 90.0,
    });
    expect(result.slide_per_unit).toBe(0.588);
  });

  it("8.5 deadair & chapters golden vectors", () => {
    const srt = `1
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
That is the whole workflow, ship it and check retention tomorrow.`;

    const cues = parseTranscript(srt);

    // deadair test
    const deadair = computeDeadAir(cues, 0.45);
    expect(deadair.duration).toBe(52.0);
    expect(deadair.removed).toBe(10.5);
    expect(deadair.out).toBe(41.5);
    expect(deadair.cuts).toHaveLength(6);
    expect(deadair.cuts[0]).toEqual({
      kind: "REPEAT",
      start: 0.0,
      end: 3.0,
      why: 'restart of "so here is how to"',
    });
    expect(deadair.cuts[1]).toEqual({
      kind: "FILLER",
      start: 3.2,
      end: 4.0,
      why: "um",
    });
    expect(deadair.cuts[2]).toEqual({
      kind: "DEAD",
      start: 4.225,
      end: 5.275,
      why: "1.50s gap",
    });
    expect(deadair.cuts[3]).toEqual({
      kind: "DEAD",
      start: 16.225,
      end: 18.775,
      why: "3.00s gap",
    });
    expect(deadair.cuts[4]).toEqual({
      kind: "DEAD",
      start: 31.225,
      end: 33.775,
      why: "3.00s gap",
    });
    expect(deadair.cuts[5]).toEqual({
      kind: "DEAD",
      start: 46.225,
      end: 46.775,
      why: "1.00s gap",
    });

    // chapters test (target 3)
    const chap = computeChapters(cues, 3);
    expect(chap.valid).toBe(true);
    expect(chap.chapters).toHaveLength(3);
    expect(chap.chapters[0].label).toBe("0:00");
    expect(chap.chapters[1].label).toBe("0:19");
    expect(chap.chapters[2].label).toBe("0:34");
  });

  it("8.6 all 21 hook formulas compile to valid RegExp", () => {
    const formulas = hooksData.hooks;
    expect(formulas).toHaveLength(21);
    for (const f of formulas) {
      expect(f.name).toBeDefined();
      expect(f.match.length).toBeGreaterThan(0);
      for (const p of f.match) {
        expect(() => new RegExp(p, "i")).not.toThrow();
      }
    }
  });
});
