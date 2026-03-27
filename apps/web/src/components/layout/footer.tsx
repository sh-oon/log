import { Flex, Text } from '@orka-log/ui';

export const Footer = () => (
  <footer className="border-t border-border py-12">
    <Flex
      justify="between"
      align="center"
      className="max-w-3xl mx-auto px-6"
    >
      <Text
        as="span"
        typography="text-sm-regular"
        color="muted"
        className="font-mono"
      >
        &copy; 2025 Jeong Seong Hun
      </Text>
      <Flex gap={6}>
        <a
          href="https://github.com/sh-oon"
          className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        <a
          href="mailto:ajcjcjc@gmail.com"
          className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          Mail
        </a>
      </Flex>
    </Flex>
  </footer>
);
