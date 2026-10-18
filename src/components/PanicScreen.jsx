import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

export const PanicScreen = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 overflow-y-auto selection:bg-blue-100 font-serif">
      {/* Google Docs style top bar */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-2.5 flex items-center justify-between font-sans text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 text-sm">
              Unit 4: Cellular Respiration & ATP Metabolic Pathways - Study Guide
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span className="text-slate-400">· Last edit was seconds ago</span>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
          title="Return to lgbtqiapluslearning (or press \)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Resume App</span>
        </button>
      </div>

      {/* Realistic Document Paper Canvas */}
      <div className="max-w-3xl mx-auto my-8 bg-white p-12 shadow-sm border border-slate-200 min-h-screen text-slate-800 leading-relaxed text-sm">
        <div className="text-right text-xs text-slate-500 font-sans mb-8">
          Student ID: #82049182 · Due: Monday, 11:59 PM · Biology 101
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-300">
          Section 4.2: Glycolysis, Pyruvate Oxidation, and the Citric Acid Cycle
        </h1>

        <h2 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Overview of Cellular Respiration</h2>
        <p className="mb-4">
          Cellular respiration is the biochemical process by which eukaryotic organisms harvest chemical energy
          stored in molecular bonds of glucose (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>) to produce adenosine triphosphate (ATP).
          The overarching balanced chemical equation represents an exergonic redox transformation:
        </p>
        <div className="bg-slate-100 p-3 rounded font-mono text-xs my-3 text-center border border-slate-200">
          C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6 O<sub>2</sub> → 6 CO<sub>2</sub> + 6 H<sub>2</sub>O + ~30–32 ATP
        </div>

        <h2 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. Phase I: Cytoplasmic Glycolysis</h2>
        <p className="mb-4">
          Glycolysis occurs universally in the cytosol of aerobic and anaerobic cells alike, independent of oxygen presence.
          The ten-step enzymatic cascade splits one six-carbon hexose into two three-carbon pyruvate molecules:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Energy Investment Phase:</strong> Two ATP equivalents are hydrolyzed to phosphorylate glucose
            into fructose-1,6-bisphosphate via hexokinase and phosphofructokinase-1 (PFK-1).
          </li>
          <li>
            <strong>Cleavage Phase:</strong> Aldolase splits fructose-1,6-bisphosphate into glyceraldehyde-3-phosphate (G3P)
            and dihydroxyacetone phosphate (DHAP).
          </li>
          <li>
            <strong>Energy Payoff Phase:</strong> Substrate-level phosphorylation yields 4 ATP and 2 NADH, resulting in a net
            gain of 2 ATP and 2 high-energy electron carriers per glucose substrate.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-slate-800 mt-6 mb-2">3. Mitochondrial Matrix: The Krebs Cycle</h2>
        <p className="mb-4">
          Pyruvate translocates across the outer and inner mitochondrial membranes via the pyruvate translocase complex.
          Through oxidative decarboxylation, pyruvate dehydrogenase converts pyruvate into Acetyl-CoA, generating 1 NADH
          and releasing CO<sub>2</sub>.
        </p>
        <p className="text-xs text-slate-500 italic mt-8 border-t pt-4">
          Press "\" or click the top-right button to exit note-taking mode.
        </p>
      </div>
    </div>
  );
};
