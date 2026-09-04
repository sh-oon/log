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

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    fontSize: 9,
    color: colors.text,
    backgroundColor: colors.white,
    paddingTop: 44,
    paddingBottom: 48,
    paddingHorizontal: 46,
    lineHeight: 1.45,
  },
  // Shared
  eyebrow: {
    fontSize: 7.5,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  // Header
  headerName: {
    fontSize: 27,
    fontWeight: 700,
    letterSpacing: -1,
    lineHeight: 1.2,
    marginTop: 6,
  },
  headerAccent: {
    color: colors.accent,
  },
  headerContact: {
    fontSize: 8.5,
    color: colors.muted,
    textAlign: 'right',
    lineHeight: 1.6,
  },
  intro: {
    fontSize: 9.5,
    color: colors.muted,
    lineHeight: 1.65,
    marginTop: 14,
  },
  introHighlight: {
    fontWeight: 700,
    color: colors.text,
  },
  // Metrics
  metrics: {
    flexDirection: 'row',
    marginTop: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricItem: {
    flex: 1,
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  metricItemLast: {
    borderRightWidth: 0,
    paddingRight: 0,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: -0.4,
    lineHeight: 1.25,
  },
  metricLabel: {
    fontSize: 8.5,
    color: colors.muted,
    marginTop: 2,
  },
  metricContext: {
    fontSize: 7.5,
    color: colors.light,
    marginTop: 1,
  },
  // Section
  section: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionEyebrow: {
    marginBottom: 10,
  },
  // Experience
  expItem: {
    flexDirection: 'row',
    marginBottom: 11,
  },
  expIndex: {
    width: 20,
    fontSize: 7.5,
    fontWeight: 700,
    color: colors.accent,
    paddingTop: 2,
  },
  expBody: {
    flex: 1,
  },
  expCompany: {
    fontSize: 10.5,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  expPeriod: {
    fontSize: 8,
    color: colors.light,
  },
  expRole: {
    fontSize: 8.5,
    color: colors.accent,
    marginTop: 1,
    marginBottom: 4,
  },
  expPoint: {
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  bullet: {
    width: 9,
    fontSize: 8.5,
    color: colors.light,
  },
  expPointText: {
    flex: 1,
    fontSize: 8.5,
    color: colors.muted,
  },
  // Project
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  projectMeta: {
    fontSize: 8,
    color: colors.light,
  },
  projectTech: {
    fontSize: 7.5,
    color: colors.light,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  projectRole: {
    fontSize: 8.5,
    color: colors.text,
    marginTop: 3,
  },
  projectSummary: {
    fontSize: 8.5,
    color: colors.muted,
  },
  resultRow: {
    flexDirection: 'row',
    marginTop: 3,
  },
  resultLabel: {
    width: 38,
    fontSize: 7,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: 0.8,
    paddingTop: 1.5,
  },
  resultText: {
    flex: 1,
    fontSize: 8.5,
    color: colors.muted,
  },
  // Skills
  skillGroup: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  skillGroupLabel: {
    width: 84,
    fontSize: 8,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: 0.4,
    paddingTop: 0.5,
  },
  skillGroupList: {
    flex: 1,
    fontSize: 8.5,
    color: colors.muted,
  },
  // Education
  eduItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  eduSchool: {
    fontSize: 9,
    fontWeight: 700,
  },
  eduCourse: {
    fontSize: 8.5,
    color: colors.muted,
  },
  eduPeriod: {
    fontSize: 8,
    color: colors.light,
  },
  // Footer
  // A4 높이 기준 상단 오프셋으로 배치한다. bottom 오프셋은 fixed 요소에서 화면 밖으로 밀린다.
  pageNumber: {
    position: 'absolute',
    top: 800,
    left: 46,
    right: 46,
    fontSize: 7.5,
    color: colors.light,
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
            <View
              key={exp.id}
              style={styles.expItem}
            >
              <Text style={styles.expIndex}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.expBody}>
                <View style={styles.row}>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  <Text style={styles.expPeriod}>{exp.period}</Text>
                </View>
                <Text style={styles.expRole}>{exp.role}</Text>
                {exp.points.map((point) => (
                  <View
                    key={point}
                    style={styles.expPoint}
                  >
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.expPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>
      )}

      {/* Projects — 성과 중심 요약. 전체 Problem/Action 서술은 웹에서 확인한다. */}
      {projects.length > 0 && (
        <Section eyebrow="02 · Selected work">
          {projects.map((proj) => (
            <View
              key={proj.id}
              style={styles.projectItem}
              wrap={false}
            >
              <View style={styles.row}>
                <Text style={styles.projectTitle}>{proj.title}</Text>
                <Text style={styles.projectMeta}>
                  {proj.company} | {proj.period}
                </Text>
              </View>
              {proj.tech.length > 0 && (
                <Text style={styles.projectTech}>{proj.tech.join(' · ')}</Text>
              )}
              {proj.role && <Text style={styles.projectRole}>{proj.role}</Text>}
              {proj.summary && <Text style={styles.projectSummary}>{proj.summary}</Text>}
              {proj.challenges.map((challenge, index) =>
                challenge.result ? (
                  <View
                    key={`${proj.id}-result-${index}`}
                    style={styles.resultRow}
                  >
                    <Text style={styles.resultLabel}>RESULT</Text>
                    <Text style={styles.resultText}>{challenge.result}</Text>
                  </View>
                ) : null
              )}
            </View>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skillGroups.length > 0 && (
        <Section eyebrow="03 · Capabilities">
          {resume.skillGroups.map((group) => (
            <View
              key={group.label}
              style={styles.skillGroup}
              wrap={false}
            >
              <Text style={styles.skillGroupLabel}>{group.label}</Text>
              <Text style={styles.skillGroupList}>{group.skills.join(' · ')}</Text>
            </View>
          ))}
        </Section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <Section eyebrow="04 · Education">
          {resume.education.map((item) => (
            <View
              key={`${item.school}-${item.period}`}
              style={styles.eduItem}
              wrap={false}
            >
              <View>
                <Text style={styles.eduSchool}>{item.school}</Text>
                <Text style={styles.eduCourse}>
                  {[item.course, item.status].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Text style={styles.eduPeriod}>{item.period}</Text>
            </View>
          ))}
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
