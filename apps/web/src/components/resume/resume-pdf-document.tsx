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

const colors = {
  text: '#333333',
  muted: '#666666',
  light: '#999999',
  border: '#e5e5e5',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.white,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.5,
  },
  // Header
  headerName: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  headerRole: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  headerContact: {
    fontSize: 9,
    color: colors.light,
  },
  // Section
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.muted,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10,
  },
  // About
  aboutText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.text,
  },
  // Metrics
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricItem: {
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.muted,
  },
  metricContext: {
    fontSize: 8,
    color: colors.light,
  },
  // Experience
  expItem: {
    marginBottom: 12,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  expCompany: {
    fontSize: 11,
    fontWeight: 700,
  },
  expPeriod: {
    fontSize: 9,
    color: colors.light,
  },
  expRole: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 4,
  },
  expPoint: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
    paddingLeft: 8,
  },
  // Project
  projectItem: {
    marginBottom: 14,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 700,
  },
  projectMeta: {
    fontSize: 9,
    color: colors.light,
  },
  projectTech: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 4,
  },
  projectLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.text,
    marginTop: 3,
  },
  projectDesc: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.5,
  },
  projectPoint: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.5,
    marginBottom: 2,
    paddingLeft: 8,
  },
  projectOutcome: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: 2,
    paddingLeft: 8,
  },
  // Skills
  skillGroup: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  skillGroupLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.text,
    width: 90,
  },
  skillGroupList: {
    flex: 1,
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.5,
  },
  // Education
  eduItem: {
    marginBottom: 8,
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eduSchool: {
    fontSize: 10,
    fontWeight: 700,
  },
  eduPeriod: {
    fontSize: 9,
    color: colors.light,
  },
  eduCourse: {
    fontSize: 9,
    color: colors.muted,
  },
});

interface ResumePdfDocumentProps {
  resume: ResumeData;
  projects: Project[];
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  const [firstItem, ...restItems] = Children.toArray(children);

  return (
    <View style={styles.section}>
      {/* Keeping the title with its first item prevents an orphaned heading at a page break. */}
      <View wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {firstItem}
      </View>
      {restItems}
    </View>
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
        <Text style={styles.headerName}>{resume.intro.name}</Text>
        <Text style={styles.headerRole}>{resume.intro.role || 'Frontend Developer'}</Text>
        <Text style={styles.headerContact}>
          {[resume.intro.email, resume.intro.github].filter(Boolean).join(' | ')}
        </Text>
      </View>

      {/* About */}
      {resume.intro.description && (
        <Section title="About">
          <Text style={styles.aboutText}>{resume.intro.description}</Text>
        </Section>
      )}

      {/* Highlights */}
      {resume.metrics.length > 0 && (
        <Section title="Highlights">
          <View
            style={styles.metricsRow}
            wrap={false}
          >
            {resume.metrics.map((metric) => (
              <View
                key={metric.label}
                style={styles.metricItem}
              >
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricContext}>{metric.context}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <Section title="Experience">
          {resume.experiences.map((exp) => (
            <View
              key={exp.id}
              style={styles.expItem}
            >
              <View style={styles.expHeader}>
                <Text style={styles.expCompany}>{exp.company}</Text>
                <Text style={styles.expPeriod}>{exp.period}</Text>
              </View>
              <Text style={styles.expRole}>{exp.role}</Text>
              {exp.points.map((point) => (
                <Text
                  key={point}
                  style={styles.expPoint}
                >
                  {`•  ${point}`}
                </Text>
              ))}
            </View>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <View
              key={proj.id}
              style={styles.projectItem}
              wrap={false}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>{proj.title}</Text>
                <Text style={styles.projectMeta}>
                  {proj.company} | {proj.period}
                </Text>
              </View>
              {proj.tech.length > 0 && (
                <Text style={styles.projectTech}>Tech: {proj.tech.join(', ')}</Text>
              )}
              <Text style={styles.projectDesc}>
                {proj.contribution ? `${proj.role} | ${proj.contribution}` : proj.role}
              </Text>
              {proj.summary && <Text style={styles.projectDesc}>{proj.summary}</Text>}
              {proj.responsibilities.length > 0 && (
                <>
                  <Text style={styles.projectLabel}>담당 업무</Text>
                  {proj.responsibilities.map((item) => (
                    <Text
                      key={item}
                      style={styles.projectPoint}
                    >
                      {`•  ${item}`}
                    </Text>
                  ))}
                </>
              )}
              {proj.outcomes.length > 0 && (
                <>
                  <Text style={styles.projectLabel}>성과</Text>
                  {proj.outcomes.map((item) => (
                    <Text
                      key={item}
                      style={styles.projectOutcome}
                    >
                      {`•  ${item}`}
                    </Text>
                  ))}
                </>
              )}
            </View>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skillGroups.length > 0 && (
        <Section title="Skills">
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
        <Section title="Education">
          {resume.education.map((item) => (
            <View
              key={`${item.school}-${item.period}`}
              style={styles.eduItem}
              wrap={false}
            >
              <View style={styles.eduHeader}>
                <Text style={styles.eduSchool}>{item.school}</Text>
                <Text style={styles.eduPeriod}>{item.period}</Text>
              </View>
              <Text style={styles.eduCourse}>
                {[item.course, item.status].filter(Boolean).join(' · ')}
              </Text>
            </View>
          ))}
        </Section>
      )}
    </Page>
  </Document>
);
