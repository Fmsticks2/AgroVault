# AgroVault Project Reorganization Plan

## Current Structure
The project currently has a flat structure with all components in the root directory:

```
├── contracts/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── ...
└── ...
```

## Target Structure
We will reorganize the project into a clear frontend and backend separation:

```
├── backend/
│   ├── contracts/
│   ├── scripts/
│   └── tests/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── index.html
│   ├── vite.config.ts
│   └── ...
└── README.md
```

## Implementation Steps

1. Create `frontend` and `backend` directories
2. Move all React/frontend-related files to the `frontend` directory
3. Move all Aleo contracts and backend-related files to the `backend` directory
4. Update import paths and configuration files
5. Update build scripts in package.json
6. Test the reorganized structure

## Benefits

- Clear separation of concerns
- Better organization for scaling the project
- Easier maintenance and collaboration
- Improved developer experience with focused contexts