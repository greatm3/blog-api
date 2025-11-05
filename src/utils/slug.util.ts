export function generateSlug(title: string): string | undefined {
    if (title && typeof title === 'string') {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/--+/g, '-');
    }
}
