const createAvatarUrl = () => {
    const size = Math.floor(Math.random() * 1000) + 25;
    // return `https://www.placecage.com/${size}/${size}`;
    return `https://picsum.photos/seed/${size}/200/200`;

};

module.exports = {createAvatarUrl}