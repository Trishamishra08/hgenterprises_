/** Extract the 11-char video id from watch / youtu.be / embed / shorts URLs. Returns '' if not a YouTube link. */
export const getYouTubeId = (url) => {
    if (!url) return '';
    const m = String(url).trim().match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
};
