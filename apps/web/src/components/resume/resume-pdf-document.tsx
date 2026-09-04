import { Children, type ReactNode } from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Project } from '@/data/projects';
import type { ResumeData } from '@/types/resume';

Font.register({
  family: 'Pretendard',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Regular.otf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Bold.otf',
      fontWeight: 700,
    },
  ],
});

// 한글은 단어 내부에 공백이 없어 기본 하이픈 분절이 어색하다. 어디서든 줄바꿈되도록 둔다.
Font.registerHyphenationCallback((word) => [word]);

// 웹 팔레트와 동일하게 blue-600 액센트 + 중립 그레이 스케일을 사용한다.
const colors = {
  accent: '#2563eb',
  text: '#171717',
  muted: '#525252',
  light: '#a3a3a3',
  border: '#e5e5e5',
  white: '#ffffff',
};

/**
 * 인접한 등급이 눈에 띄게 구분되도록 6단계만 쓴다.
 * 같은 등급 안에서의 차이는 크기가 아니라 굵기와 색으로 표현한다.
 */
const type = {
  display: 25,
  metric: 14,
  title: 10.5,
  lead: 9.5,
  body: 8.5,
  meta: 8,
  label: 7,
};

/**
 * 행간 배율.
 *
 * 주의: react-pdf는 lineHeight 비율을 "같은 스타일에 선언된 fontSize"에 곱한다.
 * fontSize 를 상속에 맡긴 채 lineHeight 만 주면 상속값이 아니라 기본 크기(18pt)에
 * 곱해져 행간이 두 배 이상 벌어진다(실측: 8.5pt 본문에 1.6 지정 시 28.8pt).
 * 그래서 lineHeight 를 선언하는 스타일에는 fontSize 도 반드시 함께 선언한다.
 */
const leading = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.45,
  relaxed: 1.6,
  loose: 1.7,
};

/** 4pt 배수 스페이싱 스케일. 세로 리듬을 이 값들로만 만든다. */
const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

const PAGE_MARGIN = 46;
// 모든 섹션 본문이 공유하는 좌측 레일. 경력·프로젝트 번호가 이 폭 안에 들어간다.
const RAIL = 22;

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    fontSize: type.body,
    color: colors.text,
    backgroundColor: colors.white,
    paddingTop: 44,
    paddingBottom: 52,
    paddingHorizontal: PAGE_MARGIN,
    lineHeight: leading.relaxed,
  },
  // Shared
  eyebrow: {
    fontSize: type.label,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: 1.6,
    lineHeight: leading.snug,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  item: {
    flexDirection: 'row',
  },
  rail: {
    width: RAIL,
    fontSize: type.label,
    fontWeight: 700,
    color: colors.accent,
    lineHeight: leading.snug,
    paddingTop: 4,
  },
  itemBody: {
    flex: 1,
  },
  // Header
  headerName: {
    fontSize: type.display,
    fontWeight: 700,
    letterSpacing: -1,
    lineHeight: leading.tight,
    marginTop: space.xs,
  },
  headerAccent: {
    color: colors.accent,
  },
  headerContact: {
    fontSize: type.meta,
    color: colors.muted,
    textAlign: 'right',
    lineHeight: leading.loose,
    paddingBottom: space.xs,
  },
  intro: {
    fontSize: type.lead,
    color: colors.muted,
    lineHeight: leading.loose,
    marginTop: space.md,
  },
  introHighlight: {
    fontWeight: 700,
    color: colors.text,
  },
  // Metrics
  metrics: {
    flexDirection: 'row',
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metricItem: {
    flex: 1,
    paddingHorizontal: space.lg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  metricItemFirst: {
    paddingLeft: 0,
  },
  metricItemLast: {
    paddingRight: 0,
    borderRightWidth: 0,
  },
  metricValue: {
    fontSize: type.metric,
    fontWeight: 700,
    letterSpacing: -0.4,
    lineHeight: leading.snug,
  },
  metricLabel: {
    fontSize: type.body,
    color: colors.muted,
    lineHeight: leading.normal,
    marginTop: space.xs,
  },
  metricContext: {
    fontSize: type.label,
    color: colors.light,
    lineHeight: leading.normal,
  },
  // Section
  section: {
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionEyebrow: {
    marginBottom: space.sm,
  },
  entry: {
    marginBottom: space.md,
  },
  entryTitle: {
    fontSize: type.title,
    fontWeight: 700,
    lineHeight: leading.snug,
  },
  entryMeta: {
    fontSize: type.meta,
    color: colors.light,
    lineHeight: leading.normal,
  },
  entrySubtitle: {
    fontSize: type.meta,
    color: colors.accent,
    lineHeight: leading.normal,
    marginBottom: space.xs,
  },
  // Experience
  point: {
    flexDirection: 'row',
  },
  bullet: {
    width: 10,
    fontSize: type.body,
    color: colors.light,
    lineHeight: leading.relaxed,
  },
  pointText: {
    flex: 1,
    fontSize: type.body,
    color: colors.muted,
    lineHeight: leading.relaxed,
  },
  // Project
  projectTech: {
    fontSize: type.label,
    color: colors.light,
    letterSpacing: 0.2,
    lineHeight: leading.normal,
  },
  projectRole: {
    fontSize: type.body,
    fontWeight: 700,
    lineHeight: leading.relaxed,
    marginTop: space.xs,
  },
  projectSummary: {
    fontSize: type.body,
    color: colors.muted,
    lineHeight: leading.relaxed,
  },
  resultRow: {
    flexDirection: 'row',
    marginTop: space.xs,
  },
  resultLabel: {
    width: 42,
    fontSize: type.label,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: 0.8,
    lineHeight: leading.normal,
    paddingTop: 2,
  },
  resultText: {
    flex: 1,
    fontSize: type.body,
    color: colors.muted,
    lineHeight: leading.relaxed,
  },
  // Skills
  skillGroup: {
    flexDirection: 'row',
    marginBottom: space.sm,
  },
  skillGroupLabel: {
    width: 80,
    fontSize: type.meta,
    fontWeight: 700,
    color: colors.accent,
    lineHeight: leading.loose,
  },
  skillGroupList: {
    flex: 1,
    fontSize: type.body,
    color: colors.muted,
    lineHeight: leading.relaxed,
  },
  // Education
  eduItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: space.xs,
  },
  eduSchool: {
    fontSize: type.body,
    fontWeight: 700,
    lineHeight: leading.relaxed,
  },
  eduCourse: {
    fontSize: type.body,
    color: colors.muted,
    lineHeight: leading.relaxed,
  },
  // Footer
  // A4 높이 기준 상단 오프셋으로 배치한다. bottom 오프셋은 fixed 요소에서 화면 밖으로 밀린다.
  pageNumber: {
    position: 'absolute',
    top: 800,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    fontSize: type.label,
    color: colors.light,
    lineHeight: leading.normal,
    textAlign: 'right',
  },
});

interface ResumePdfDocumentProps {
  resume: ResumeData;
  projects: Project[];
}

interface SectionProps {
  eyebrow: string;
  children: ReactNode;
}

const Section = ({ eyebrow, children }: SectionProps) => {
  const [firstItem, ...restItems] = Children.toArray(children);

  return (
    <View style={styles.section}>
      {/* 제목과 첫 항목을 묶어 섹션 제목이 페이지 하단에 홀로 남지 않게 한다. */}
      <View wrap={false}>
        <Text style={[styles.eyebrow, styles.sectionEyebrow]}>{eyebrow}</Text>
        {firstItem}
      </View>
      {restItems}
    </View>
  );
};

interface EntryProps {
  index?: number;
  children: ReactNode;
}

/** 모든 섹션 본문이 같은 좌측 레일에서 시작하도록 감싼다. */
const Entry = ({ index, children }: EntryProps) => (
  <View
    style={[styles.item, styles.entry]}
    wrap={false}
  >
    <Text style={styles.rail}>{index === undefined ? '' : String(index + 1).padStart(2, '0')}</Text>
    <View style={styles.itemBody}>{children}</View>
  </View>
);

interface IntroProps {
  description: string;
  highlight: string;
}

/** 웹 페이지와 동일하게 강조 문구만 굵게 표시한다. */
const Intro = ({ description, highlight }: IntroProps) => {
  const index = highlight ? description.indexOf(highlight) : -1;

  if (index < 0) return <Text style={styles.intro}>{description}</Text>;

  return (
    <Text style={styles.intro}>
      {description.slice(0, index)}
      <Text style={styles.introHighlight}>{highlight}</Text>
      {description.slice(index + highlight.length)}
    </Text>
  );
};

export const ResumePdfDocument = ({ resume, projects }: ResumePdfDocumentProps) => (
  <Document
    title={`${resume.intro.name} 이력서`}
    author={resume.intro.name}
  >
    <Page
      size="A4"
      style={styles.page}
    >
      {/* Header */}
      <View>
        <Text style={styles.eyebrow}>{resume.intro.role || 'Frontend Developer'}</Text>
        <View style={styles.row}>
          <Text style={styles.headerName}>
            {resume.intro.name}
            <Text style={styles.headerAccent}>.</Text>
          </Text>
          <Text style={styles.headerContact}>
            {resume.intro.email}
            {'\n'}
            {resume.intro.github.replace(/^https?:\/\//, '')}
          </Text>
        </View>
        <Intro
          description={resume.intro.description}
          highlight={resume.intro.highlight}
        />
      </View>

      {/* Highlights */}
      {resume.metrics.length > 0 && (
        <View
          style={styles.metrics}
          wrap={false}
        >
          {resume.metrics.map((metric, index) => (
            <View
              key={metric.label}
              style={[
                styles.metricItem,
                index === 0 ? styles.metricItemFirst : {},
                index === resume.metrics.length - 1 ? styles.metricItemLast : {},
              ]}
            >
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricContext}>{metric.context}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <Section eyebrow="01 · Experience">
          {resume.experiences.map((exp, index) => (
            <Entry
              key={exp.id}
              index={index}
            >
              <View style={styles.row}>
                <Text style={styles.entryTitle}>{exp.company}</Text>
                <Text style={styles.entryMeta}>{exp.period}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{exp.role}</Text>
              {exp.points.map((point) => (
                <View
                  key={point}
                  style={styles.point}
                >
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </Entry>
          ))}
        </Section>
      )}

      {/* Projects — 성과 중심 요약. 전체 Problem/Action 서술은 웹에서 확인한다. */}
      {projects.length > 0 && (
        <Section eyebrow="02 · Selected work">
          {projects.map((proj, index) => (
            <Entry
              key={proj.id}
              index={index}
            >
              <View style={styles.row}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                <Text style={styles.entryMeta}>
                  {proj.company} | {proj.period}
                </Text>
              </View>
              {proj.tech.length > 0 && (
                <Text style={styles.projectTech}>{proj.tech.join(' · ')}</Text>
              )}
              {proj.role && <Text style={styles.projectRole}>{proj.role}</Text>}
              {proj.summary && <Text style={styles.projectSummary}>{proj.summary}</Text>}
              {proj.challenges.map((challenge, challengeIndex) =>
                challenge.result ? (
                  <View
                    key={`${proj.id}-result-${challengeIndex}`}
                    style={styles.resultRow}
                  >
                    <Text style={styles.resultLabel}>RESULT</Text>
                    <Text style={styles.resultText}>{challenge.result}</Text>
                  </View>
                ) : null
              )}
            </Entry>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skillGroups.length > 0 && (
        <Section eyebrow="03 · Capabilities">
          <Entry>
            {resume.skillGroups.map((group) => (
              <View
                key={group.label}
                style={styles.skillGroup}
              >
                <Text style={styles.skillGroupLabel}>{group.label}</Text>
                <Text style={styles.skillGroupList}>{group.skills.join(' · ')}</Text>
              </View>
            ))}
          </Entry>
        </Section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <Section eyebrow="04 · Education">
          <Entry>
            {resume.education.map((item) => (
              <View
                key={`${item.school}-${item.period}`}
                style={styles.eduItem}
              >
                <Text>
                  <Text style={styles.eduSchool}>{item.school}</Text>
                  <Text style={styles.eduCourse}>
                    {`  ${[item.course, item.status].filter(Boolean).join(' · ')}`}
                  </Text>
                </Text>
                <Text style={styles.entryMeta}>{item.period}</Text>
              </View>
            ))}
          </Entry>
        </Section>
      )}

      <Text
        fixed
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </Page>
  </Document>
);
