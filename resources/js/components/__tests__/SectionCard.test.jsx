import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionCard from '../SectionCard'; // Adjust path as needed

describe('SectionCard', () => {
    test('renders children correctly', () => {
        render(
            <SectionCard>
                <p>Test Child</p>
            </SectionCard>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    test('renders title when provided', () => {
        render(<SectionCard title="Test Title">Children</SectionCard>);
        expect(screen.getByRole('heading', { name: /Test Title/i, level: 2 })).toBeInTheDocument();
    });

    test('does not render title when not provided', () => {
        render(<SectionCard>Children</SectionCard>);
        expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    test('applies base classes and additional className', () => {
        const { container } = render(<SectionCard className="custom-class">Children</SectionCard>);
        const divElement = container.firstChild;
        expect(divElement).toHaveClass('bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col');
        expect(divElement).toHaveClass('custom-class');
    });

    test('applies titleClassName to the title', () => {
        render(<SectionCard title="Test Title" titleClassName="custom-title-class">Children</SectionCard>);
        const titleElement = screen.getByRole('heading', { name: /Test Title/i, level: 2 });
        expect(titleElement).toHaveClass('text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100');
        expect(titleElement).toHaveClass('custom-title-class');
    });

    test('renders without crashing if titleClassName is provided but title is not', () => {
        render(<SectionCard titleClassName="custom-title-class">Children</SectionCard>);
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
});
