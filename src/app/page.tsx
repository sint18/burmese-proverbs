"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CosmicBackground } from "@/components/cosmic-background";
import { BlackHoleInput } from "@/components/black-hole-input";
import { ProverbCard } from "@/components/proverb-card";
import { WormholeLoader } from "@/components/wormhole-loader";
import { SupernovaError } from "@/components/supernova-error";
import { ProverbDialog } from "@/components/proverb-dialog";
import { LoadMoreIndicator } from "@/components/load-more-indicator";
import { getAllProverbs, getNextProverbs } from "@/lib/firebase";
import { generateProverb } from "@/lib/generate-proverb";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";

export default function HomePage() {
  const [proverbs, setProverbs] = useState<Array<Proverb>>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [lastDoc, setLastDoc] = useState<Proverb | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProverb, setNewProverb] = useState<string>("");

  useEffect(() => {
    const loadInitialProverbs = async () => {
      try {
        setIsLoadingMore(true);
        const initialProverbs = await getAllProverbs();
        setProverbs(initialProverbs);
        if (initialProverbs.length > 0) {
          setLastDoc(initialProverbs[initialProverbs.length - 1]);
        }
        setHasMore(initialProverbs.length === 6);
      } catch (err) {
        console.error("Failed to load initial proverbs:", err);
      } finally {
        setIsLoadingMore(false);
      }
    };

    loadInitialProverbs();
  }, []);

  const loadMoreProverbs = useCallback(async () => {
    if (isLoadingMore || !hasMore || !lastDoc) return;

    try {
      setIsLoadingMore(true);
      const newProverbs = await getNextProverbs(lastDoc);

      if (newProverbs.length > 0) {
        setProverbs((prev) => [...prev, ...newProverbs]);
        setLastDoc(newProverbs[newProverbs.length - 1]);
        setHasMore(newProverbs.length === 6);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more proverbs:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, lastDoc]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreProverbs();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserverTarget = observerTarget.current;

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [loadMoreProverbs, hasMore, isLoadingMore]);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!inputValue) {
        setError("စကားလုံးထည့်ပါ... (eg, ခွေး)");
        return;
      }

      const generatedProverb = await generateProverb(inputValue);
      if (!generatedProverb) {
        setError("အမှားတစ်ခု ပေါက်ကွဲသွားပြီ! 🚀");
        return;
      }
      setNewProverb(generatedProverb);
      setInputValue("");
      setDialogOpen(true);

      const refreshedProverbs = await getAllProverbs();
      setProverbs(refreshedProverbs);
      if (refreshedProverbs.length > 0) {
        setLastDoc(refreshedProverbs[refreshedProverbs.length - 1]);
      }
    } catch {
      setError("အမှားတစ်ခု ပေါက်ကွဲသွားပြီ! 🚀");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" relative" ref={containerRef}>
      <CosmicBackground />

      <div className="flex flex-col items-center relative z-10 p-6">
        <div className="mx-auto max-w-4xl w-full">
          <h1 className="mb-8 text-center text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text">
            Myanmar Proverbs
          </h1>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row">
            <BlackHoleInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="🤔 စကားလုံးထည့်ပါ... (eg, ခွေး)"
            />
            <Button
              className={twMerge(
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                "py-3 rounded-lg h-full text-lg font-medium bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-lg"
              )}
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Get Proverb"}
            </Button>
          </div>

          {isLoading && <WormholeLoader />}
          {error && (
            <SupernovaError message={error} onRetry={() => handleGenerate()} />
          )}
        </div>

        <div className="mx-auto mt-8 max-w-4xl w-full max-h-[70vh] pb-16 overflow-y-auto">
          {proverbs.length === 0 && !isLoadingMore ? (
            <div className="rounded-lg border border-purple-500/20 bg-purple-900/20 py-12 flex items-center justify-center">
              <p className="text-2xl text-purple-400">မရှိသေးပါ</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {proverbs.map((proverb) => (
                  <ProverbCard key={proverb.id} proverb={proverb} />
                ))}
              </div>

              <div ref={observerTarget} className="mt-4 h-4 w-full" />

              {isLoadingMore && <LoadMoreIndicator />}

              {!hasMore && proverbs.length > 0 && (
                <div className="py-8 text-center text-purple-300">
                  <p>You&apos;ve reached the end of the cosmic wisdom</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProverbDialog
        proverb={{
          text: newProverb,
          id: "generated-proverb",
        }}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
