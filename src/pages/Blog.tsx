import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '@/data/mockData';
import { ArrowLeft, Clock, User } from 'lucide-react';

export function BlogList() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">Blog</h1>
        <p className="text-center text-muted-foreground mb-12">Insights, strategies, and education for smarter betting.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="card-elevated-hover p-6 flex flex-col">
              <span className="text-xs font-medium text-primary mb-2">{p.category}</span>
              <h3 className="font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{p.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{p.author}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.readTime}</span>
                <span>{p.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return <div className="py-24 text-center text-muted-foreground">Post not found</div>;

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <span className="text-xs font-medium text-primary">{post.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span>{post.author}</span><span>{post.date}</span><span>{post.readTime} read</span>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">{post.content}</p>
          <p className="text-muted-foreground leading-relaxed mt-4">This is a preview article. Full content will be available when the platform launches.</p>
        </div>
      </div>
    </div>
  );
}
