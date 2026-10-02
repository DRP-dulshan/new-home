import Image from 'next/image';
import { articleHref, formatArticleDate, type NewsArticle } from '@/data/news';
import SmartLink from '../ui/SmartLink';

type Props = { article: NewsArticle; featured?: boolean };

/** Article tile used on /news and under each article. */
export default function ArticleCard({ article, featured }: Props) {
  return (
    <article className="group h-full">
      <SmartLink
        href={articleHref(article.slug)}
        className={`flex h-full flex-col ${featured ? 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-12' : ''}`}
      >
        <div
          className={`relative w-full overflow-hidden bg-line ${
            featured ? 'aspect-[16/10] lg:col-span-7' : 'aspect-[4/3]'
          }`}
        >
          <Image
            src={article.image}
            alt={article.alt}
            fill
            loading="lazy"
            sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="object-cover transition-transform duration-[700ms] ease-premium group-hover:scale-[1.06]"
          />
        </div>
        <div className={`flex flex-1 flex-col ${featured ? 'lg:col-span-5' : ''}`}>
          <p className="mt-5 text-[10px] font-medium uppercase tracking-eyebrow text-orange">{article.category}</p>
          <h3
            className={`mt-3 font-serif font-normal leading-snug text-charcoal transition-colors duration-300 group-hover:text-orange ${
              featured ? 'text-[clamp(1.8rem,3vw,2.6rem)]' : 'text-xl sm:text-[1.4rem]'
            }`}
          >
            {article.title}
          </h3>
          <p className="mt-3 text-[14px] font-light leading-relaxed text-charcoal-muted">{article.excerpt}</p>
          <div className="mt-auto pt-5">
            <div className="flex items-center justify-between border-t border-line pt-4 text-[11px] font-light uppercase tracking-wide text-charcoal-muted">
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
              <span>{article.readMinutes} min read</span>
            </div>
          </div>
        </div>
      </SmartLink>
    </article>
  );
}
