export function generateExcerpt(content: string): string | undefined {
    if (content && typeof content === 'string') {
        let excerpt = '';

        const characters = content.split('');

        if (characters.length > 200) {
            const lastSpaceIndex = characters.slice(0, 200).lastIndexOf(' ');
            excerpt = characters.slice(0, lastSpaceIndex).join('') + '...';

            return excerpt;
        }

        return content;
    }
}
