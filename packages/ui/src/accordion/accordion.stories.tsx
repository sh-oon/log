import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const meta = {
  title: 'Data Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
    children: null,
  },
  render: () => (
    <Accordion
      type="single"
      className="w-full max-w-md"
    >
      <AccordionItem value="faq-1">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            You can return any item within 30 days of purchase for a full refund. Items must be in
            their original condition and packaging.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Standard shipping takes 5-7 business days. Express shipping is available for 2-3
            business day delivery at an additional cost.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionTrigger>Do you offer international shipping?</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Yes, we ship to over 50 countries worldwide. International shipping times vary by
            destination and typically take 10-14 business days.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    children: null,
  },
  render: () => (
    <Accordion
      type="multiple"
      className="w-full max-w-md"
    >
      <AccordionItem value="section-1">
        <AccordionTrigger>Personal Information</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Update your name, email, and phone number associated with your account.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="section-2">
        <AccordionTrigger>Security Settings</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Manage your password, two-factor authentication, and recovery options.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="section-3">
        <AccordionTrigger>Notification Preferences</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Choose which notifications you want to receive via email, SMS, or push notifications.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDefaultOpen: Story = {
  args: {
    type: 'single',
    defaultValue: ['intro'],
    children: null,
  },
  render: () => (
    <Accordion
      type="single"
      defaultValue={['intro']}
      className="w-full max-w-md"
    >
      <AccordionItem value="intro">
        <AccordionTrigger>Introduction</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            This section is open by default. It contains introductory information that users should
            see first when they visit this page.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="details">
        <AccordionTrigger>Details</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Additional details that can be expanded when needed by the user.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced">
        <AccordionTrigger>Advanced Options</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            Advanced configuration options for power users.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Disabled: Story = {
  args: {
    type: 'single',
    children: null,
  },
  render: () => (
    <Accordion
      type="single"
      className="w-full max-w-md"
    >
      <AccordionItem value="available">
        <AccordionTrigger>Available Section</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            This section can be opened and closed normally.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="disabled"
        disabled
      >
        <AccordionTrigger>Disabled Section</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            This content should not be visible because the item is disabled.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="another">
        <AccordionTrigger>Another Available Section</AccordionTrigger>
        <AccordionContent>
          <Text
            as="p"
            typography="text-sm-regular"
            color="muted"
          >
            This is another section that can be interacted with normally.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
