"use client";

import { useEffect, useRef, useState } from "react";
import { Data, Network, Options } from "vis-network";
import { sampleWorkers } from "@/lib/sample-data";
import type { WorkerSummary } from "@/lib/types";

interface ReferralGraphProps {
  minTrust?: number;
  distance?: "you" | "one" | "two" | "all";
  onNodeClick?: (nodeId: string) => void;
}

// Sample network data - clients and connections
const sampleClients = [
  { id: "aisha", name: "Aisha", type: "client" },
  { id: "farouk", name: "Farouk", type: "client" },
  { id: "chidi", name: "Chidi", type: "client" },
  { id: "hassan", name: "Hassan", type: "client" },
  { id: "amaka", name: "Amaka", type: "client" },
];

export function ReferralGraph({
  minTrust = 60,
  distance = "two",
  onNodeClick,
}: ReferralGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Filter workers by trust score
    const filteredWorkers = sampleWorkers.filter(
      (w) => w.trust.total >= minTrust
    );

    // Filter by distance
    let workersToShow = filteredWorkers;
    if (distance === "you") {
      workersToShow = []; // Only show "You" node
    } else if (distance === "one") {
      workersToShow = filteredWorkers.filter((w) => w.inYourNetworkSteps === 1);
    } else if (distance === "two") {
      workersToShow = filteredWorkers.filter((w) => w.inYourNetworkSteps <= 2);
    }
    // "all" shows all filtered workers

    // Create nodes
    const nodes: any[] = [
      {
        id: "you",
        label: "You",
        color: { background: "#fbbf24", border: "#f59e0b" },
        font: { color: "#000", size: 14, face: "Lexend Deca", bold: true },
        shape: "circle",
        size: 30,
        borderWidth: 3,
      },
    ];

    // Add clients
    sampleClients.forEach((client) => {
      nodes.push({
        id: client.id,
        label: client.name,
        color: { background: "#10b981", border: "#059669" },
        font: { color: "#fff", size: 12, face: "Lexend Deca" },
        shape: "circle",
        size: 20,
      });
    });

    // Add workers
    workersToShow.forEach((worker) => {
      const getTradeColor = (trade: string) => {
        if (trade === "Electrician") return { bg: "#f59e0b", border: "#d97706" };
        if (trade === "Plumber") return { bg: "#3b82f6", border: "#2563eb" };
        if (trade === "Cleaner") return { bg: "#10b981", border: "#059669" };
        return { bg: "#8b5cf6", border: "#7c3aed" };
      };

      const colors = getTradeColor(worker.trade);
      nodes.push({
        id: worker.id,
        label: `${worker.name}\n${worker.trade}`,
        color: { background: colors.bg, border: colors.border },
        font: { color: "#fff", size: 11, face: "Lexend Deca" },
        shape: "box",
        size: 25,
        title: `${worker.name} (${worker.trade})\nTrust: ${worker.trust.total}\nLocation: ${worker.locationLabel}`,
      });
    });

    // Create edges based on pathToYou
    const edges: any[] = [];
    
    // Connect "You" to first-level clients
    const firstLevelClients = ["aisha", "chidi", "hassan", "amaka"];
    firstLevelClients.forEach((clientId) => {
      edges.push({
        from: "you",
        to: clientId,
        color: { color: "#60a5fa", highlight: "#3b82f6" },
        width: 2,
        arrows: "to",
        label: "knows",
        font: { size: 10, color: "#60a5fa" },
      });
    });

    // Connect clients to workers based on pathToYou
    workersToShow.forEach((worker) => {
      const pathParts = worker.pathToYou.split(" → ");
      if (pathParts.length >= 3) {
        const clientName = pathParts[1].toLowerCase();
        const clientId = sampleClients.find(
          (c) => c.name.toLowerCase() === clientName
        )?.id;

        if (clientId) {
          edges.push({
            from: clientId,
            to: worker.id,
            color: { color: "#34d399", highlight: "#10b981" },
            width: 2,
            arrows: "to",
            label: "referred",
            font: { size: 10, color: "#34d399" },
          });
        }
      }
    });

    // Some additional connections between clients
    edges.push({
      from: "aisha",
      to: "farouk",
      color: { color: "#a78bfa", highlight: "#8b5cf6" },
      width: 1,
      arrows: "to",
      dashes: true,
      label: "connected",
      font: { size: 9, color: "#a78bfa" },
    });

    const data: Data = { nodes, edges };

    const options: Options = {
      nodes: {
        borderWidth: 2,
        shadow: true,
        font: {
          face: "Lexend Deca",
        },
      },
      edges: {
        smooth: {
          type: "continuous",
          roundness: 0.5,
        },
        shadow: true,
        font: {
          face: "Lexend Deca",
        },
      },
      physics: {
        enabled: true,
        stabilization: { iterations: 200 },
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.1,
          springLength: 150,
          springConstant: 0.04,
          damping: 0.09,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true,
      },
      layout: {
        improvedLayout: true,
      },
    };

    const network = new Network(containerRef.current, data, options);

    // Handle node clicks
    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0] as string;
        setSelectedNode(nodeId);
        if (onNodeClick && nodeId !== "you" && !sampleClients.find((c) => c.id === nodeId)) {
          onNodeClick(nodeId);
        }
      }
    });

    // Handle hover
    network.on("hoverNode", (params) => {
      containerRef.current!.style.cursor = "pointer";
    });

    network.on("blurNode", () => {
      containerRef.current!.style.cursor = "default";
    });

    networkRef.current = network;

    return () => {
      network.destroy();
    };
  }, [minTrust, distance, onNodeClick]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full min-h-[420px] rounded-lg"
      style={{ backgroundColor: "#1e293b" }}
    />
  );
}

