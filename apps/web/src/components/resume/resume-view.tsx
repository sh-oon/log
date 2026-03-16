import { Chip, Flex, Icon, Text } from '@sunghoon-log/ui';
import { getProjects, getResume } from '@/lib/resume';
import { ProjectRow } from './project-row';
import { WorkItem } from './work-item';

export const ResumeView = () => {
  const resume = getResume();
  const projects = getProjects();

  return (
    <>
      {/* Intro */}
      <section className="mb-20">
        <Text
          as="h1"
          typography="title-2xl-bold"
          className="mb-6 tracking-tight"
        >
          {resume.intro.name}
        </Text>
        <Text
          typography="text-lg-regular"
          color="muted"
          className="leading-relaxed"
        >
          {resume.intro.description.split(resume.intro.highlight)[0]}
          <Text
            as="span"
            typography="text-lg-medium"
            color="foreground"
          >
            {resume.intro.highlight}
          </Text>
          {resume.intro.description.split(resume.intro.highlight)[1]}
        </Text>
      </section>

      {/* Experience */}
      <section className="mb-20">
        <Flex
          as="h2"
          align="center"
          className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8"
        >
          <Icon
            name="monitor"
            size={16}
            className="mr-2"
          />{' '}
          Professional Experience
        </Flex>
        <div className="space-y-12">
          {resume.experiences.map((exp) => (
            <WorkItem
              key={exp.id}
              company={exp.company}
              role={exp.role}
              period={exp.period}
              points={exp.points}
            />
          ))}
        </div>
      </section>

      {/* Selected Projects */}
      <section className="mb-20">
        <Text
          as="h2"
          color="muted"
          className="text-sm font-bold uppercase tracking-widest mb-8"
        >
          Selected Projects
        </Text>
        <div className="grid grid-cols-1 gap-6">
          {projects.map((proj) => (
            <ProjectRow
              key={proj.id}
              project={proj}
            />
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <Text
          as="h2"
          color="muted"
          className="text-sm font-bold uppercase tracking-widest mb-6"
        >
          Technical Skills
        </Text>
        <Flex
          wrap="wrap"
          gap={2}
        >
          {resume.skills.map((skill) => (
            <Chip
              key={skill}
              size="sm"
            >
              {skill}
            </Chip>
          ))}
        </Flex>
      </section>
    </>
  );
};
