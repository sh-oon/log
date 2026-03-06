import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: { children: null },
  render: () => (
    <div className="flex items-center justify-center p-20">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
          >
            Open Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => console.log('Profile')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Help')}>Help</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// WithSeparatorAndLabel
// ---------------------------------------------------------------------------

export const WithSeparatorAndLabel: Story = {
  args: { children: null },
  render: () => (
    <div className="flex items-center justify-center p-20">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
          >
            Account
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => console.log('Profile')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Settings')}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Support</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => console.log('Help Center')}>
            Help Center
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Feedback')}>Feedback</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// WithDestructive
// ---------------------------------------------------------------------------

export const WithDestructive: Story = {
  args: { children: null },
  render: () => (
    <div className="flex items-center justify-center p-20">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
          >
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => console.log('Edit')}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Duplicate')}>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            destructive
            onSelect={() => console.log('Delete')}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Alignment
// ---------------------------------------------------------------------------

export const Alignment: Story = {
  args: { children: null },
  render: () => (
    <div className="flex items-center justify-between p-20">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
          >
            Align Start
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Option A</DropdownMenuItem>
          <DropdownMenuItem>Option B</DropdownMenuItem>
          <DropdownMenuItem>Option C</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
          >
            Align Center
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem>Option A</DropdownMenuItem>
          <DropdownMenuItem>Option B</DropdownMenuItem>
          <DropdownMenuItem>Option C</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
          >
            Align End
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Option A</DropdownMenuItem>
          <DropdownMenuItem>Option B</DropdownMenuItem>
          <DropdownMenuItem>Option C</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
