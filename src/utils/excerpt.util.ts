export function generateExcerpt(content: string): string | undefined {
    if (typeof content === 'string' && content !== "") {
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
