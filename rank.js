var TOKEN = "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"
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

function gitUpload(data) {

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: TOKEN
    });

    gitDownload({
        owner: data.owner,
        repo: data.repo,
        name: data.name,
        token: TOKEN
    }).then(res => {
        
        octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: data.owner,
            repo: data.repo,
            path: data.name,
            message: "upload score from api",
            branch: 'score_rank',
            content: data.content,
            sha: res.sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).then(res => {
            console.log(res);
        });
    });
    

    
    // return fetch(
    //     `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}`,
    //     {
    //         method: "PUT",
    //         headers: {
    //             Accept: "application/vnd.github+json",
    //             Authorization: `Bearer ${data.token}`
    //         },
    //         body: JSON.stringify({
    //             message: "upload score from api",
    //             content: data.content,
    //             branch: "score_rank"
    //         })
    //     }
    // ).then((res) => res.json());
}

function gitDownload(data) {
    const queryParams = new URLSearchParams({ ref: "score_rank" }).toString();
    return fetch(
        `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}?${queryParams}`,
        {
            method: "GET",
            cache: "no-store",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${data.token}`
            },
        }
    ).then((res) => res.json());

}

var old = null;

gitDownload({
    owner: 'ElonAbergel',
    repo: 'demo-p5js-Group-9-tv-1',
    name: 'ranking_data.txt',
    token: TOKEN
}).then(res => {
    old = atob(res.content);
    old = JSON.parse(old);
    $('#rank-list').html(
        old.map((item, index) => {
            return `<li>${item}</li>`;
        }).join('')
    );
    old.push(666);
    gitUpload({
        owner: 'ElonAbergel',
        repo: 'demo-p5js-Group-9-tv-1',
        name: 'ranking_data.txt',
        content: btoa(JSON.stringify(old)),
        token: TOKEN
    });
});





