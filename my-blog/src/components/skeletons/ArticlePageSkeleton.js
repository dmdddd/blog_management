import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ArticlePageSkeleton = () => (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
    {/* Simulate a blog title */}
    <Skeleton height={40} width="60%" style={{ marginBottom: '20px' }} />

    {/* Simulate blog meta info like author and date */}
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Skeleton circle={true} height={50} width={50} style={{ marginRight: '10px' }} />
        <Skeleton height={20} width="40%" />
    </div>

    {/* Simulate the blog content */}
    <Skeleton count={10} height={20} style={{ marginBottom: '10px' }} />
    <Skeleton height={20} width="80%" style={{ marginBottom: '10px' }} />

    {/* Simulate comments section */}
    <h3>
        <Skeleton height={30} width="30%" />
    </h3>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Skeleton circle={true} height={40} width={40} style={{ marginRight: '10px' }} />
        <Skeleton height={20} width="60%" />
    </div>
    <Skeleton count={3} height={15} width="90%" style={{ marginBottom: '5px' }} />
</div>
);

export default ArticlePageSkeleton;