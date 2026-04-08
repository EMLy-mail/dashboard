<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { statusColors, statusLabels, formatDate } from "$lib/utils";
    import {
        Paperclip,
        RefreshCcw,
        Inbox,
        Loader2,
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Table from "$lib/components/ui/table";
    import * as Empty from "$lib/components/ui/empty";

    let { data } = $props();
    let refreshing = $state(false);

    async function refreshReports() {
        refreshing = true;
        try {
            await invalidateAll();
        } catch (err) {
            console.error("Failed to refresh reports:", err);
        } finally {
            refreshing = false;
        }
    }
</script>

<div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-end">
        <Button onclick={refreshReports} disabled={refreshing} style="cursor: pointer;">
            {#if refreshing}
                <Loader2 class="h-4 w-4 animate-spin" />
                Refreshing...
            {:else}
                <RefreshCcw class="h-4 w-4" />
                Refresh
            {/if}
        </Button>
    </div>

    <!-- Table -->
    {#if data.reports.length === 0}
        <div class="rounded-lg border border-border bg-card">
            <Empty.Root class="p-8">
                <Empty.Header>
                    <Empty.Media variant="icon">
                        <Inbox class="h-10 w-10 text-muted-foreground" />
                    </Empty.Media>
                    <Empty.Title>No reports found</Empty.Title>
                    <Empty.Description>
                        There are no bug reports yet.
                    </Empty.Description>
                </Empty.Header>
                <Empty.Content>
                    <Button variant="outline" onclick={refreshReports} disabled={refreshing}>
                        {#if refreshing}
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        {:else}
                            <RefreshCcw class="mr-2 h-4 w-4" />
                        {/if}
                        Refresh
                    </Button>
                </Empty.Content>
            </Empty.Root>
        </div>
    {:else}
        <div class="overflow-hidden rounded-lg border border-border">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-20">ID</Table.Head>
                        <Table.Head>Hostname</Table.Head>
                        <Table.Head>User</Table.Head>
                        <Table.Head>Reporter</Table.Head>
                        <Table.Head>Status</Table.Head>
                        <Table.Head>Files</Table.Head>
                        <Table.Head class="text-right">Created</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each data.reports as report (report.id)}
                        <Table.Row
                            class="cursor-pointer"
                            onclick={() => goto(`/reports/${report.id}`)}
                        >
                            <Table.Cell class="font-mono text-muted-foreground"
                                >#{report.id}</Table.Cell
                            >
                            <Table.Cell>{report.hostname || "—"}</Table.Cell>
                            <Table.Cell>{report.os_user || "—"}</Table.Cell>
                            <Table.Cell>
                                <div class="font-medium">{report.name}</div>
                                <div class="text-xs text-muted-foreground">
                                    {report.email}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium {statusColors[
                                        report.status
                                    ]}"
                                >
                                    {statusLabels[report.status]}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                {#if report.file_count > 0}
                                    <span
                                        class="inline-flex items-center gap-1 text-muted-foreground"
                                    >
                                        <Paperclip class="h-3.5 w-3.5" />
                                        {report.file_count}
                                    </span>
                                {:else}
                                    <span class="text-muted-foreground">—</span>
                                {/if}
                            </Table.Cell>
                            <Table.Cell
                                class="text-right text-muted-foreground"
                            >
                                {formatDate(report.created_at)}
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}
</div>
