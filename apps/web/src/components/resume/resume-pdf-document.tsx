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
  // Skills
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    fontSize: 9,
    color: colors.muted,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
});

interface ResumePdfDocumentProps {
  resume: ResumeData;
  projects: Project[];
}

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

export const ResumePdfDocument = ({ resume, projects }: ResumePdfDocumentProps) => (
  <Document>
    <Page
      size="A4"
      style={styles.page}
    >
      {/* Header */}
      <View>
        <Text style={styles.headerName}>{resume.intro.name}</Text>
        <Text style={styles.headerRole}>{resume.intro.highlight || 'Frontend Developer'}</Text>
        <Text style={styles.headerContact}>ajcjcjc@gmail.com | GitHub</Text>
      </View>

      {/* About */}
      {resume.intro.description && (
        <View style={styles.section}>
          <SectionTitle>About</SectionTitle>
          <Text style={styles.aboutText}>{resume.intro.description}</Text>
        </View>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Experience</SectionTitle>
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
                  {`\u2022  ${point}`}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Projects</SectionTitle>
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
              {proj.challenges.map((ch, ci) => (
                <View key={`${proj.id}-ch-${ci}`}>
                  {proj.challenges.length > 1 && (
                    <Text
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: colors.light,
                        marginTop: 6,
                        marginBottom: 2,
                      }}
                    >
                      Challenge {ci + 1}
                    </Text>
                  )}
                  {ch.problem && (
                    <>
                      <Text style={styles.projectLabel}>Problem</Text>
                      <Text style={styles.projectDesc}>{ch.problem}</Text>
                    </>
                  )}
                  {ch.action && (
                    <>
                      <Text style={styles.projectLabel}>Action</Text>
                      <Text style={styles.projectDesc}>{ch.action}</Text>
                    </>
                  )}
                  {ch.result && (
                    <>
                      <Text style={styles.projectLabel}>Result</Text>
                      <Text style={styles.projectDesc}>{ch.result}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Skills</SectionTitle>
          <View style={styles.skillsRow}>
            {resume.skills.map((skill) => (
              <Text
                key={skill}
                style={styles.skillChip}
              >
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);
