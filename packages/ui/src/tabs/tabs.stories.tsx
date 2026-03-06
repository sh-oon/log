import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabContent, TabList, Tabs, TabTrigger } from './tabs';

const meta = {
  title: 'Action/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'account',
    children: (
      <>
        <TabList>
          <TabTrigger value="account">Account</TabTrigger>
          <TabTrigger value="password">Password</TabTrigger>
          <TabTrigger value="notifications">Notifications</TabTrigger>
        </TabList>
        <TabContent value="account">
          <p className="text-sm-regular text-foreground p-4">
            Manage your account settings and preferences.
          </p>
        </TabContent>
        <TabContent value="password">
          <p className="text-sm-regular text-foreground p-4">
            Change your password and security settings.
          </p>
        </TabContent>
        <TabContent value="notifications">
          <p className="text-sm-regular text-foreground p-4">
            Configure your notification preferences.
          </p>
        </TabContent>
      </>
    ),
  },
};

export const Controlled: Story = {
  args: { defaultValue: 'tab1', children: null },
  render: () => {
    const [value, setValue] = useState('tab1');
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm-regular text-muted-foreground">
          Current tab: <strong>{value}</strong>
        </p>
        <Tabs
          defaultValue="tab1"
          value={value}
          onValueChange={setValue}
        >
          <TabList>
            <TabTrigger value="tab1">First</TabTrigger>
            <TabTrigger value="tab2">Second</TabTrigger>
            <TabTrigger value="tab3">Third</TabTrigger>
          </TabList>
          <TabContent value="tab1">
            <p className="text-sm-regular text-foreground p-4">First tab content.</p>
          </TabContent>
          <TabContent value="tab2">
            <p className="text-sm-regular text-foreground p-4">Second tab content.</p>
          </TabContent>
          <TabContent value="tab3">
            <p className="text-sm-regular text-foreground p-4">Third tab content.</p>
          </TabContent>
        </Tabs>
      </div>
    );
  },
};

export const DisabledTab: Story = {
  args: {
    defaultValue: 'general',
    children: (
      <>
        <TabList>
          <TabTrigger value="general">General</TabTrigger>
          <TabTrigger
            value="billing"
            disabled
          >
            Billing
          </TabTrigger>
          <TabTrigger value="team">Team</TabTrigger>
        </TabList>
        <TabContent value="general">
          <p className="text-sm-regular text-foreground p-4">General settings content.</p>
        </TabContent>
        <TabContent value="billing">
          <p className="text-sm-regular text-foreground p-4">Billing settings content.</p>
        </TabContent>
        <TabContent value="team">
          <p className="text-sm-regular text-foreground p-4">Team management content.</p>
        </TabContent>
      </>
    ),
  },
};
