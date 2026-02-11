import { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Clock as LucideClock,
  ArrowLeft as LucideArrowLeft,
  ArrowRight as LucideArrowRight,
  Share2 as LucideShare2,
  Sparkles as LucideSparkles,
  Calendar as LucideCalendar,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  BLOG_POSTS,
  getBlogPostBySlug,
  getRecentPosts,
} from "@/lib/blog-posts";
import { BlogContent } from './blog-content';

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;
const Clock = LucideClock as any;
const ArrowLeft = LucideArrowLeft as any;
const ArrowRight = LucideArrowRight as any;
const Share2 = LucideShare2 as any;
const Sparkles = LucideSparkles as any;
const Calendar = LucideCalendar as any;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Turf Talk",
    };
  }

  return {
    title: `${post.title} | Turf Talk`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recentPosts = getRecentPosts(3).filter((p) => p.slug !== slug);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Find previous and next posts
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost =
    currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb
        items={[{ label: "Turf Talk", href: "/blog" }, { label: post.title }]}
      />

      {/* Hero Image */}
      <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container">
            <div className="max-w-4xl">
              <Link
                href={`/blog?category=${encodeURIComponent(post.category)}`}
                className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold mb-4 hover:bg-primary/90 transition-colors"
              >
                {post.category}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-white">
                    {post.author.name}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <BlogContent content={post.content} />

              {/* Share */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Share this article</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm">
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="w-4 h-4" />
                      Previous Article
                    </div>
                    <p className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {prevPost.title}
                    </p>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all md:text-right"
                  >
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                      Next Article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <p className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {nextPost.title}
                    </p>
                  </Link>
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Author Card */}
                <div className="p-6 rounded-2xl bg-white border border-border/50 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Turf World Team
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our experts share their knowledge to help you create the
                    perfect outdoor space.
                  </p>
                </div>

                {/* Related Posts */}
                {recentPosts.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-4">
                      More From Turf Talk
                    </h3>
                    <div className="space-y-4">
                      {recentPosts.slice(0, 2).map((relatedPost) => (
                        <Link
                          key={relatedPost.slug}
                          href={`/blog/${relatedPost.slug}`}
                          className="group flex gap-4"
                        >
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedPost.readTime} min read
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                  <Sparkles className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">
                    Ready to Get Started?
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    Get free turf samples shipped to your door.
                  </p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <Link href="/samples">Get Free Samples</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-8 border-t bg-muted/30">
        <div className="container">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Turf Talk
          </Link>
        </div>
      </section>
    </div>
  );
}
