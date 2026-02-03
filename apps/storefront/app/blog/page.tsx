import { Metadata } from "next";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  MessageSquare as LucideMessageSquare,
  Clock as LucideClock,
  ArrowRight as LucideArrowRight,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  Sparkles as LucideSparkles,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  BLOG_POSTS,
  getFeaturedPost,
  getAllCategories,
  POSTS_PER_PAGE,
} from "@/lib/blog-posts";

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;
const MessageSquare = LucideMessageSquare as any;
const Clock = LucideClock as any;
const ArrowRight = LucideArrowRight as any;
const ChevronLeft = LucideChevronLeft as any;
const ChevronRight = LucideChevronRight as any;
const Sparkles = LucideSparkles as any;

export const metadata: Metadata = {
  title: "Turf Talk | Artificial Turf Tips, Guides & News",
  description:
    "Expert tips, installation guides, and the latest news about artificial turf. Learn from the pros at Turf World.",
  keywords: [
    "artificial turf blog",
    "turf installation tips",
    "artificial grass guide",
    "lawn care tips",
    "turf maintenance",
  ],
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const selectedCategory = params.category;

  const featuredPost = getFeaturedPost();
  const categories = getAllCategories();

  // Filter posts by category if selected
  let filteredPosts = selectedCategory
    ? BLOG_POSTS.filter((post) => post.category === selectedCategory)
    : BLOG_POSTS;

  // Remove featured post from regular listing
  if (!selectedCategory && featuredPost) {
    filteredPosts = filteredPosts.filter((p) => p.slug !== featuredPost.slug);
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Turf Talk" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Turf Talk
            </h1>
            <p className="text-lg text-white/60">
              Expert tips, installation guides, and the latest news from Turf
              World
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b bg-white">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!selectedCategory && featuredPost && currentPage === 1 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mb-8">
              <span className="text-caption uppercase tracking-widest text-primary font-semibold">
                Featured Article
              </span>
            </div>

            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold group-hover:text-primary transition-colors mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                        <Image
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">
                        {featuredPost.author.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} min read
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:underline">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          {!selectedCategory && currentPage === 1 && (
            <div className="mb-8">
              <span className="text-caption uppercase tracking-widest text-primary font-semibold">
                Latest Articles
              </span>
              <h2 className="mt-2">More From Turf Talk</h2>
            </div>
          )}

          {selectedCategory && (
            <div className="mb-8">
              <span className="text-caption uppercase tracking-widest text-primary font-semibold">
                Category
              </span>
              <h2 className="mt-2">{selectedCategory}</h2>
              <p className="text-muted-foreground mt-2">
                {filteredPosts.length} article
                {filteredPosts.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full bg-white rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`}
                >
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Link
                    key={page}
                    href={`/blog?page=${page}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`}
                  >
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                    >
                      {page}
                    </Button>
                  </Link>
                )
              )}

              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`}
                >
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-emerald-700">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-white">Ready to Start Your Project?</h2>
            <p className="mt-4 text-xl text-white/80">
              Get free samples shipped to your door and see the quality
              firsthand.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/samples">
                  Get Free Samples
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/calculator">Use Calculator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
