/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { useState } from "react";
import { trackEvent } from "../Analytics";
import WorkspaceClass from "../components/WorkspaceClass";
import { useWorkspaceClasses } from "../data/workspaces/workspace-classes-query";

interface SelectWorkspaceClassProps {
    workspaceClass?: string;
    setWorkspaceClass: (value: string) => Promise<string | undefined>;
}

export default function SelectWorkspaceClass(props: SelectWorkspaceClassProps) {
    const [workspaceClass, setWorkspaceClass] = useState<string | undefined>(props.workspaceClass);
    const supportedClasses = useWorkspaceClasses();
    const actuallySetWorkspaceClass = async (value: string) => {
        const previousValue = await props.setWorkspaceClass(value);
        if (previousValue !== value) {
            trackEvent("workspace_class_changed", {
                previous: previousValue,
                current: value,
            });
            setWorkspaceClass(value);
        }
    };

    return (
        <div className="mt-4 space-x-3 flex">
            {supportedClasses.data?.map((c) => {
                return (
                    <WorkspaceClass
                        additionalStyles="w-80"
                        selected={workspaceClass === c.id}
                        onClick={() => actuallySetWorkspaceClass(c.id)}
                        category={c.category}
                        friendlyName={c.displayName}
                        description={c.description}
                        powerUps={c.powerups}
                    />
                );
            })}
        </div>
    );
}
