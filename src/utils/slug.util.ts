export function generateSlug(title: string): string | undefined {
    if (typeof title === 'string' && title !== "") {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/--+/g, '-');
    }
}
